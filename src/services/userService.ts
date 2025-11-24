import { apiClient } from "@/services/api/apiClient";
import { supabaseService } from "@/services/supabaseService";
import { supabase } from "@/lib/supabase";
import type { DashboardData, NotificationItem, SavedEventSummary } from "@/types/dashboard";
import type { EventItem } from "@/types/event";

const withFallback = async <T>(request: () => Promise<T>, fallback: () => Promise<T>) => {
  try {
    return await request();
  } catch (error) {
    console.warn("[userService] API request failed, trying Supabase", error);
    return fallback();
  }
};

export const userService = {
  async getDashboard(): Promise<DashboardData> {
    return withFallback(
      async () => {
        const { data } = await apiClient.get<DashboardData>("/users/dashboard");
        return data;
      },
      async () => {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Get saved events
        const savedEventsData = await supabaseService.users.getSavedEvents(user.id);
        
        // Get events for saved events
        const savedEvents: SavedEventSummary[] = [];
        for (const saved of savedEventsData) {
          const event = await supabaseService.events.getById(saved.event_id);
          if (event) {
            savedEvents.push({
              id: event.id,
              title: event.title,
              date: new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              image: event.image_url || "",
            });
          }
        }

        // Get upcoming events (events with future dates)
        const allEvents = await supabaseService.events.list();
        const today = new Date().toISOString().split('T')[0];
        const upcomingEvents: EventItem[] = allEvents
          .filter(event => event.date >= today)
          .slice(0, 10)
          .map(event => ({
            id: event.id,
            title: event.title,
            image: event.image_url || "",
            date: event.date,
            time: event.time,
            location: event.location,
            price: event.is_free ? "Free" : `$${event.price}`,
            isFree: event.is_free,
            category: event.category,
            speakers: "",
            description: event.description || "",
            attendees: 0,
          }));

        // Count registrations (would need to query event_registrations)
        const registeredEvents = 0; // TODO: Count from event_registrations

        // Count following speakers (would need to query user_following_speakers)
        const followingSpeakers = 0; // TODO: Count from user_following_speakers

        return {
          stats: {
            registeredEvents,
            savedEvents: savedEvents.length,
            followingSpeakers,
            pastEvents: 0, // Would need to count past events
          },
          upcomingEvents,
          savedEvents,
          notifications: [], // Would need notifications system
        };
      },
    );
  },

  async saveEvent(event: SavedEventSummary) {
    return withFallback(
      async () => {
        const { data } = await apiClient.post("/users/saved-events", event);
        return data;
      },
      async () => {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        await supabaseService.users.saveEvent(user.id, event.id);
        return { success: true };
      },
    );
  },

  async removeSavedEvent(id: string) {
    return withFallback(
      async () => {
        const { data } = await apiClient.delete(`/users/saved-events/${id}`);
        return data;
      },
      async () => {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        await supabaseService.users.removeSavedEvent(user.id, id);
        return { success: true };
      },
    );
  },
};

