import { supabase } from "@/lib/supabase";
import { env } from "@/config/env";
import { apiClient } from "@/services/api/apiClient";
import type { Credentials, RegisterPayload, AuthTokens } from "@/types/auth";
import type { UserProfile } from "@/types/user";
import { tokenManager } from "@/utils/tokenManager";
import { handleError } from "@/utils/errorHandler";
import { logError } from "@/services/errorLogger";

const AUTH_ROUTES = {
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
};

interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

/**
 * Check if Supabase Auth is available
 */
const isSupabaseAvailable = (): boolean => {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
};

/**
 * Map Supabase user to UserProfile
 */
const mapSupabaseUserToProfile = (supabaseUser: any): UserProfile => {
  const userMetadata = supabaseUser.user_metadata || supabaseUser.raw_user_meta_data || {};
  const appMetadata = supabaseUser.app_metadata || supabaseUser.raw_app_meta_data || {};
  
  // Check role in order: app_metadata > user_metadata > default
  const role = (appMetadata.role || userMetadata.role || "user") as UserProfile["role"];
  
  return {
    id: supabaseUser.id,
    name: userMetadata.name || supabaseUser.email?.split("@")[0] || "User",
    email: supabaseUser.email || "",
    role,
    avatarUrl: userMetadata.avatar_url || userMetadata.avatarUrl,
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at || supabaseUser.created_at,
  };
};

/**
 * Create user profile record in database after Supabase Auth signup
 * Note: Supabase Auth handles user authentication. This creates a profile record
 * in a separate users table if it exists (optional - user metadata is already stored in auth.users)
 */
const createUserRecord = async (userId: string, name: string, email: string, role: string = "user") => {
  // Check if users table exists by trying to query it
  // If it doesn't exist, we'll just use auth.users metadata
  try {
    const { error } = await supabase
      .from("users")
      .insert({
        id: userId,
        name,
        email,
        role,
      })
      .select()
      .single();

    // Ignore duplicate key errors (user might already exist)
    if (error) {
      // Table doesn't exist or duplicate key - both are okay
      if (error.code === "PGRST116" || error.message.includes("does not exist") || 
          error.message.includes("duplicate") || error.code?.includes("23505")) {
        // This is fine - table might not exist or user already exists
        return;
      }
      console.warn("[authService] Failed to create user record:", error);
      logError(error, { context: "authService:createUserRecord" });
    }
  } catch (error) {
    // Table doesn't exist - that's okay, we'll use auth.users metadata
    console.debug("[authService] Users table doesn't exist, using auth.users metadata");
  }
};

/**
 * Helper to try Supabase Auth first, fallback to REST API
 */
const withSupabaseFallback = async <T>(
  supabaseOperation: () => Promise<T>,
  apiFallback: () => Promise<T>
): Promise<T> => {
  if (!isSupabaseAvailable()) {
    console.warn("[authService] Supabase not configured, using REST API fallback");
    try {
      return await apiFallback();
    } catch (error) {
      // If REST API also fails, provide helpful error
      throw new Error(
        "Authentication service is not available. Please ensure Supabase is configured in .env file or backend server is running."
      );
    }
  }

  try {
    return await supabaseOperation();
  } catch (error) {
    // If Supabase fails with a known auth error, don't fall back - show the actual error
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Known Supabase auth errors (don't fallback for these)
    const supabaseAuthErrors = [
      "Invalid login credentials",
      "User already registered",
      "Email not confirmed",
      "Password should be at least",
      "Unable to validate email address",
      "signup_disabled",
    ];
    
    if (supabaseAuthErrors.some(msg => errorMessage.includes(msg))) {
      // This is a real Supabase error - don't fallback, throw it
      throw error;
    }
    
    console.warn("[authService] Supabase operation failed, trying REST API fallback:", error);
    try {
      return await apiFallback();
    } catch (apiError) {
      // If both fail, prefer the Supabase error message
      throw error;
    }
  }
};

class AuthService {
  private currentUser: UserProfile | null = null;

  async login(payload: Credentials): Promise<UserProfile> {
    return withSupabaseFallback(
      // Supabase Auth
      async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: payload.email,
          password: payload.password,
        });

        if (error) {
          throw new Error(error.message || "Login failed");
        }

        if (!data.user || !data.session) {
          throw new Error("Invalid response from authentication service");
        }

        const user = mapSupabaseUserToProfile(data.user);
        
        // Sync session tokens with tokenManager for backward compatibility
        if (data.session) {
          tokenManager.saveTokens({
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresAt: data.session.expires_at ? data.session.expires_at * 1000 : undefined,
            remember: payload.remember,
          });
        }

        this.currentUser = user;
        return user;
      },
      // REST API Fallback
      async () => {
        try {
          const response = await apiClient.post<AuthResponse>(AUTH_ROUTES.login, payload);
          this.handleAuthSuccess(response.data, payload.remember);
          return response.data.user;
        } catch (error) {
          throw new Error(handleError(error, { context: "auth:login" }));
        }
      }
    );
  }

  async register(payload: RegisterPayload): Promise<UserProfile> {
    return withSupabaseFallback(
      // Supabase Auth
      async () => {
        const { data, error } = await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: {
            data: {
              name: payload.name,
              role: "user", // Default role
            },
          },
        });

        if (error) {
          throw new Error(error.message || "Registration failed");
        }

        if (!data.user) {
          throw new Error("Invalid response from authentication service");
        }

        const user = mapSupabaseUserToProfile(data.user);

        // Create user record in database
        if (data.user.id) {
          await createUserRecord(data.user.id, payload.name, payload.email, "user");
        }

        // Sync session tokens if session exists (might not exist if email confirmation is required)
        if (data.session) {
          tokenManager.saveTokens({
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresAt: data.session.expires_at ? data.session.expires_at * 1000 : undefined,
          });
          this.currentUser = user;
        } else {
          // Email confirmation required - user will need to confirm before logging in
          console.info("[authService] Email confirmation required");
        }

        return user;
      },
      // REST API Fallback
      async () => {
        try {
          const response = await apiClient.post<AuthResponse>(AUTH_ROUTES.register, payload);
          this.handleAuthSuccess(response.data);
          return response.data.user;
        } catch (error) {
          throw new Error(handleError(error, { context: "auth:register" }));
        }
      }
    );
  }

  async fetchCurrentUser(): Promise<UserProfile | null> {
    return withSupabaseFallback(
      // Supabase Auth
      async () => {
        // Check if we have a session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          this.currentUser = null;
          return null;
        }

        // Get user from session
        const { data: userData, error } = await supabase.auth.getUser();

        if (error || !userData.user) {
          this.currentUser = null;
          return null;
        }

        const user = mapSupabaseUserToProfile(userData.user);
        
        // Sync tokens
        if (sessionData.session) {
          tokenManager.saveTokens({
            accessToken: sessionData.session.access_token,
            refreshToken: sessionData.session.refresh_token,
            expiresAt: sessionData.session.expires_at ? sessionData.session.expires_at * 1000 : undefined,
          });
        }

        this.currentUser = user;
        return user;
      },
      // REST API Fallback
      async () => {
        try {
          const response = await apiClient.get<UserProfile>(AUTH_ROUTES.me);
          this.currentUser = response.data;
          return this.currentUser;
        } catch (error) {
          if (tokenManager.isTokenExpired()) {
            await this.refreshTokens().catch(() => this.logout());
          }
          return null;
        }
      }
    );
  }

  async refreshTokens() {
    return withSupabaseFallback(
      // Supabase Auth (handles refresh automatically)
      async () => {
        const { data, error } = await supabase.auth.refreshSession();

        if (error || !data.session) {
          this.logout();
          throw new Error(error?.message || "Failed to refresh session");
        }

        tokenManager.saveTokens({
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at ? data.session.expires_at * 1000 : undefined,
        });

        return {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at ? data.session.expires_at * 1000 : undefined,
        };
      },
      // REST API Fallback
      async () => {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) throw new Error("Missing refresh token");

        try {
          const response = await apiClient.post<AuthTokens>(AUTH_ROUTES.refresh, { refreshToken });
          tokenManager.saveTokens({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            expiresAt: response.data.expiresAt,
          });
          return response.data;
        } catch (error) {
          this.logout();
          throw new Error(handleError(error, { context: "auth:refresh" }));
        }
      }
    );
  }

  async logout() {
    // Try Supabase logout first
    if (isSupabaseAvailable()) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.warn("[authService] Supabase logout error:", error);
      }
    }

    // Also try REST API logout (fallback)
    try {
      await apiClient.post(AUTH_ROUTES.logout).catch(() => undefined);
    } catch (error) {
      // Ignore errors
    }

    // Clear local state
    tokenManager.clearTokens();
    this.currentUser = null;
  }

  private handleAuthSuccess({ user, tokens }: AuthResponse, remember?: boolean) {
    this.currentUser = user;
    tokenManager.saveTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      remember,
    });
  }
}

export const authService = new AuthService();

