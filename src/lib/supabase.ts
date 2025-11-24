import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import type { Database } from "@/types/database";

/**
 * Supabase client for database operations
 * 
 * The client automatically handles:
 * - Authentication (if using Supabase Auth)
 * - Real-time subscriptions
 * - Row Level Security (RLS) policies
 * - Connection pooling
 */
// Create Supabase client only if credentials are provided
export const supabase = (() => {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    // Return a dummy client if not configured (will fail gracefully)
    return createClient<Database>(
      "https://placeholder.supabase.co",
      "placeholder-key",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }

  return createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
})();

/**
 * Check if Supabase is properly configured
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      console.warn("[Supabase] URL or Anon Key not configured");
      return false;
    }

    // Test connection with a simple query
    const { error } = await supabase.from("events").select("id").limit(1);
    
    if (error) {
      // If table doesn't exist, that's okay - connection works
      if (error.code === "PGRST116" || error.message.includes("does not exist")) {
        console.warn("[Supabase] Connected but tables not yet created");
        return true;
      }
      console.error("[Supabase] Connection error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Supabase] Failed to check connection:", error);
    return false;
  }
};

/**
 * Initialize Supabase (called on app startup)
 */
export const initializeSupabase = async (): Promise<void> => {
  try {
    const isConnected = await checkSupabaseConnection();
    if (isConnected) {
      console.log("✅ Supabase connected successfully");
    } else {
      console.warn("⚠️ Supabase not connected - using mock data fallback");
    }
  } catch (error) {
    console.error("[Supabase] Initialization error:", error);
  }
};

