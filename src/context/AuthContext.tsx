import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authService } from "@/services/authService";
import type { AuthState, Credentials, RegisterPayload } from "@/types/auth";
import { tokenManager } from "@/utils/tokenManager";

type AuthContextValue = AuthState & {
  login: (payload: Credentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const bootstrap = useCallback(async () => {
    if (!tokenManager.getAccessToken()) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const user = await authService.fetchCurrentUser();
      setState({
        user,
        isAuthenticated: Boolean(user),
        isLoading: false,
      });
    } catch {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (payload: Credentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const user = await authService.login(payload);
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const user = await authService.register(payload);
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const refresh = useCallback(async () => {
    try {
      await authService.refreshTokens();
      await bootstrap();
    } catch (error) {
      logout();
      throw error;
    }
  }, [bootstrap, logout]);

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      refresh,
    }),
    [login, register, logout, refresh, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

