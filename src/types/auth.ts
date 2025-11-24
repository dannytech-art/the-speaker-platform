import type { UserProfile } from "./user";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
}

export interface Credentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  acceptPrivacy: boolean;
}

