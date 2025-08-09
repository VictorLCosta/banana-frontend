import { LoginCredentials, UserDetails } from "@/models";
import { createContext } from "react";

export type AuthContextValue = {
  user: UserDetails | null;
  isLoading: boolean;
  login: (creds: LoginCredentials) => Promise<void>;
  refreshUser: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);