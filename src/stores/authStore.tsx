import type { UserDetails, LoginCredentials, AuthResponse } from "#/index";
import { useEffect, useState } from "react";

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

import api, { loadTokensFromStorage, setAuthTokens } from "@/lib/api-client";
import { AuthContext, AuthContextValue } from "./authContext";

// endpoints
const fetchMe = async (): Promise<UserDetails> => {
  const { data } = await api.get('/users/me'); // ajusta se for /auth/me
  return data;
};

const loginRequest = async (creds: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post('/tokens', creds);
  return data;
};

export const AuthProvider: React.FC<{ children: React.ReactNode, qc: QueryClient }> = ({ children, qc }) => {
  const [localInitLoading, setLocalInitLoading] = useState(true);

  useEffect(() => {
    loadTokensFromStorage();
    setLocalInitLoading(false);
  }, []);

  const { data: user, isLoading, refetch } = useQuery<UserDetails>({
    queryKey: ['me'],
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !localInitLoading,
  });

  const loginMutation = useMutation({
    mutationFn: (creds: LoginCredentials) => loginRequest(creds),
    onSuccess: async (resp) => {
      setAuthTokens(resp.token ?? null, resp.refreshToken ?? null);

      // recarrega usuário
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const login = async (creds: LoginCredentials) => {
    await loginMutation.mutateAsync(creds);
  };

  const value: AuthContextValue = {
    user: user ?? null,
    isLoading: isLoading || localInitLoading,
    login,
    refreshUser: () => refetch(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
