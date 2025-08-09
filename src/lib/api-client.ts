/* eslint-disable @typescript-eslint/no-explicit-any */

import { env } from '@/config/env';

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = env.API_URL || 'http://localhost:5009/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

const STORAGE_ACCESS_KEY = 'accessToken';
const STORAGE_REFRESH_KEY = 'refreshToken';

export const setAuthTokens = (accessToken: string | null, refreshToken: string | null) => {
  inMemoryAccessToken = accessToken;
  inMemoryRefreshToken = refreshToken;

  if (accessToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    try {
      localStorage.setItem(STORAGE_ACCESS_KEY, accessToken);
    } catch {}
  } else {
    delete api.defaults.headers.common['Authorization'];
    try { localStorage.removeItem(STORAGE_ACCESS_KEY); } catch {}
  }

  if (refreshToken) {
    try { localStorage.setItem(STORAGE_REFRESH_KEY, refreshToken); } catch {}
  } else {
    try { localStorage.removeItem(STORAGE_REFRESH_KEY); } catch {}
  }
};

export const loadTokensFromStorage = () => {
  try {
    const at = localStorage.getItem(STORAGE_ACCESS_KEY);
    const rt = localStorage.getItem(STORAGE_REFRESH_KEY);
    if (at) {
      inMemoryAccessToken = at;
      api.defaults.headers.common['Authorization'] = `Bearer ${at}`;
    }
    if (rt) {
      inMemoryRefreshToken = rt;
    }
    return { accessToken: at, refreshToken: rt };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
};

export const clearAuthTokens = () => {
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;
  delete api.defaults.headers.common['Authorization'];
  try {
    localStorage.removeItem(STORAGE_ACCESS_KEY);
    localStorage.removeItem(STORAGE_REFRESH_KEY);
  } catch {}
};

/** refresh request */
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (err: any) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      if (token && p.config.headers) {
        p.config.headers['Authorization'] = `Bearer ${token}`;
      }
      p.resolve(undefined);
    }
  });
  failedQueue = [];
};

const refreshTokenRequest = async (): Promise<{ accessToken: string; refreshToken?: string } | null> => {
  try {
    const rt = inMemoryRefreshToken ?? localStorage.getItem(STORAGE_REFRESH_KEY);
    if (!rt) return null;
    const { data } = await axios.post(`${API_URL}/tokens/refresh`, { refreshToken: rt });
    // espera { accessToken, refreshToken? }
    return data;
  } catch (err) {
    return null;
  }
};

// interceptor response: tenta refresh em 401
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // push to queue e aguarda
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              // re-executa a requisição
              if (originalRequest.headers && inMemoryAccessToken) {
                originalRequest.headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
              }
              originalRequest._retry = true;
              resolve(api(originalRequest));
            },
            reject,
            config: originalRequest,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await refreshTokenRequest();
        if (!tokens || !tokens.accessToken) {
          processQueue(new Error('No refresh token or refresh failed'), null);
          clearAuthTokens();
          isRefreshing = false;
          return Promise.reject(err);
        }

        setAuthTokens(tokens.accessToken, tokens.refreshToken ?? inMemoryRefreshToken);
        isRefreshing = false;
        processQueue(null, tokens.accessToken);

        // set header and retry original
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearAuthTokens();
        isRefreshing = false;
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
