/**
 * Supabase Service
 * 
 * This service provides database operations using Supabase.
 * All methods include automatic fallback to mock data if Supabase is not configured.
 */

import { supabase } from "@/lib/supabase";
import { env } from "@/config/env";
import type { Database } from "@/types/database";

type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
type Inserts<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
type Updates<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];

// Check if Supabase is configured
const isSupabaseConfigured = (): boolean => {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
};

/**
 * Helper to wrap Supabase operations with fallback
 */
const withSupabaseFallback = async <T>(
  operation: () => Promise<T>,
  fallback: () => T
): Promise<T> => {
  if (!isSupabaseConfigured()) {
    console.warn("[supabaseService] Supabase not configured, using fallback");
    return fallback();
  }

  try {
    return await operation();
  } catch (error) {
    console.warn("[supabaseService] Supabase operation failed, using fallback:", error);
    return fallback();
  }
};

export const supabaseService = {
  /**
   * Check if Supabase is available
   */
  isAvailable(): boolean {
    return isSupabaseConfigured();
  },

  /**
   * Events operations
   */
  events: {
    async list(filters?: {
      search?: string;
      category?: string;
      isFree?: boolean;
    }): Promise<Tables<"events">[]> {
      return withSupabaseFallback(
        async () => {
          let query = supabase.from("events").select("*");

          if (filters?.category && filters.category !== "all") {
            query = query.eq("category", filters.category);
          }

          if (filters?.isFree !== undefined) {
            query = query.eq("is_free", filters.isFree);
          }

          if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
          }

          const { data, error } = await query.order("date", { ascending: true });

          if (error) throw error;
          return data || [];
        },
        () => []
      );
    },

    async getById(id: string): Promise<Tables<"events"> | null> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          return data;
        },
        () => null
      );
    },

    async create(event: Inserts<"events">): Promise<Tables<"events">> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("events")
            .insert(event)
            .select()
            .single();

          if (error) throw error;
          return data;
        },
        () => {
          // Return mock event for fallback
          return event as Tables<"events">;
        }
      );
    },

    async update(id: string, updates: Updates<"events">): Promise<Tables<"events">> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("events")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;
          return data;
        },
        () => {
          return updates as Tables<"events">;
        }
      );
    },

    async delete(id: string): Promise<void> {
      return withSupabaseFallback(
        async () => {
          const { error } = await supabase.from("events").delete().eq("id", id);
          if (error) throw error;
        },
        () => {
          // No-op for fallback
        }
      );
    },

    async register(eventId: string, registration: {
      userId?: string;
      name: string;
      email: string;
      phone?: string;
    }): Promise<Tables<"event_registrations">> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("event_registrations")
            .insert({
              event_id: eventId,
              user_id: registration.userId || null,
              name: registration.name,
              email: registration.email,
              phone: registration.phone || null,
            })
            .select()
            .single();

          if (error) throw error;
          return data;
        },
        () => {
          return {
            id: `reg-${Date.now()}`,
            event_id: eventId,
            user_id: registration.userId || null,
            name: registration.name,
            email: registration.email,
            phone: registration.phone || null,
            created_at: new Date().toISOString(),
          } as Tables<"event_registrations">;
        }
      );
    },
  },

  /**
   * Speakers operations
   */
  speakers: {
    async list(filters?: {
      search?: string;
      industry?: string;
      verified?: boolean;
    }): Promise<Tables<"speakers">[]> {
      return withSupabaseFallback(
        async () => {
          let query = supabase.from("speakers").select("*");

          if (filters?.industry) {
            query = query.eq("industry", filters.industry);
          }

          if (filters?.verified !== undefined) {
            query = query.eq("verified", filters.verified);
          }

          if (filters?.search) {
            query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,title.ilike.%${filters.search}%`);
          }

          const { data, error } = await query.order("created_at", { ascending: false });

          if (error) throw error;
          return data || [];
        },
        () => []
      );
    },

    async getById(id: string): Promise<Tables<"speakers"> | null> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("speakers")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          return data;
        },
        () => null
      );
    },

    async getFollowingStatus(userId: string, speakerId: string): Promise<boolean> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("user_following_speakers")
            .select("id")
            .eq("user_id", userId)
            .eq("speaker_id", speakerId)
            .maybeSingle();

          if (error) throw error;
          return !!data;
        },
        () => false
      );
    },

    async follow(userId: string, speakerId: string): Promise<void> {
      return withSupabaseFallback(
        async () => {
          const { error } = await supabase
            .from("user_following_speakers")
            .insert({
              user_id: userId,
              speaker_id: speakerId,
            });

          if (error) throw error;
        },
        () => {
          // No-op for fallback
        }
      );
    },

    async unfollow(userId: string, speakerId: string): Promise<void> {
      return withSupabaseFallback(
        async () => {
          const { error } = await supabase
            .from("user_following_speakers")
            .delete()
            .eq("user_id", userId)
            .eq("speaker_id", speakerId);

          if (error) throw error;
        },
        () => {
          // No-op for fallback
        }
      );
    },

    async getSpeakerEvents(speakerId: string): Promise<Tables<"events">[]> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("event_speakers")
            .select(`
              event_id,
              events (*)
            `)
            .eq("speaker_id", speakerId);

          if (error) throw error;
          return (data || []).map((item: any) => item.events).filter(Boolean);
        },
        () => []
      );
    },

    async apply(application: Inserts<"speaker_applications">): Promise<Tables<"speaker_applications">> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("speaker_applications")
            .insert(application)
            .select()
            .single();

          if (error) throw error;
          return data;
        },
        () => {
          return application as Tables<"speaker_applications">;
        }
      );
    },
  },

  /**
   * User operations
   */
  users: {
    async saveEvent(userId: string, eventId: string): Promise<void> {
      return withSupabaseFallback(
        async () => {
          const { error } = await supabase
            .from("user_saved_events")
            .insert({
              user_id: userId,
              event_id: eventId,
            });

          if (error) throw error;
        },
        () => {
          // No-op for fallback
        }
      );
    },

    async removeSavedEvent(userId: string, eventId: string): Promise<void> {
      return withSupabaseFallback(
        async () => {
          const { error } = await supabase
            .from("user_saved_events")
            .delete()
            .eq("user_id", userId)
            .eq("event_id", eventId);

          if (error) throw error;
        },
        () => {
          // No-op for fallback
        }
      );
    },

    async getSavedEvents(userId: string): Promise<Tables<"user_saved_events">[]> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("user_saved_events")
            .select("*")
            .eq("user_id", userId);

          if (error) throw error;
          return data || [];
        },
        () => []
      );
    },
  },

  /**
   * Admin operations
   */
  admin: {
    async getCategories(): Promise<Tables<"categories">[]> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true });

          if (error) throw error;
          return data || [];
        },
        () => []
      );
    },

    async updateCategory(id: number, updates: Updates<"categories">): Promise<Tables<"categories">> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("categories")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;
          return data;
        },
        () => {
          return updates as Tables<"categories">;
        }
      );
    },

    async getAds(): Promise<Tables<"advertisements">[]> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("advertisements")
            .select("*")
            .gte("active_until", new Date().toISOString().split('T')[0])
            .order("created_at", { ascending: false });

          if (error) throw error;
          return data || [];
        },
        () => []
      );
    },

    async createAd(ad: Inserts<"advertisements">): Promise<Tables<"advertisements">> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("advertisements")
            .insert(ad)
            .select()
            .single();

          if (error) throw error;
          return data;
        },
        () => {
          return ad as Tables<"advertisements">;
        }
      );
    },

    async updateAd(id: string, updates: Updates<"advertisements">): Promise<Tables<"advertisements">> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("advertisements")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;
          return data;
        },
        () => {
          return updates as Tables<"advertisements">;
        }
      );
    },

    async deleteAd(id: string): Promise<void> {
      return withSupabaseFallback(
        async () => {
          const { error } = await supabase
            .from("advertisements")
            .delete()
            .eq("id", id);

          if (error) throw error;
        },
        () => {
          // No-op for fallback
        }
      );
    },

    async getSpeakerApplications(): Promise<Tables<"speaker_applications">[]> {
      return withSupabaseFallback(
        async () => {
          const { data, error } = await supabase
            .from("speaker_applications")
            .select("*")
            .eq("status", "pending")
            .order("created_at", { ascending: false });

          if (error) throw error;
          return data || [];
        },
        () => []
      );
    },
  },
};

