import { apiClient } from "@/services/api/apiClient";
import { supabaseService } from "@/services/supabaseService";
import type { AdminStats, AdminAd } from "@/types/admin";
import type { EventItem } from "@/types/event";
import type { SpeakerProfile } from "@/types/speaker";

const withFallback = async <T>(request: () => Promise<T>, fallback: () => T) => {
  try {
    return await request();
  } catch (error) {
    console.warn("[adminService] API request failed, trying Supabase", error);
    // Try Supabase if API fails
    return fallback();
  }
};

export const adminService = {
  async getOverview() {
    return withFallback(
      async () => {
        const { data } = await apiClient.get("/admin/dashboard");
        return data;
      },
      async () => {
        // Use Supabase as fallback
        const [events, categories, speakers, ads] = await Promise.all([
          supabaseService.events.list(),
          supabaseService.admin.getCategories(),
          supabaseService.admin.getSpeakerApplications(),
          supabaseService.admin.getAds(),
        ]);

        // Transform events to EventItem format
        const transformedEvents: EventItem[] = events.map((event) => ({
          id: event.id,
          title: event.title,
          image: event.image_url || "",
          date: event.date,
          time: event.time,
          location: event.location,
          price: event.is_free ? "Free" : `$${event.price}`,
          isFree: event.is_free,
          category: event.category,
          speakers: "", // Will be populated from event_speakers table
          description: event.description || "",
        }));

        // Transform speakers to SpeakerProfile format
        const transformedSpeakers: SpeakerProfile[] = speakers.map((app) => ({
          id: app.id,
          name: `${app.first_name} ${app.last_name}`,
          firstName: app.first_name,
          lastName: app.last_name,
          title: app.title,
          industry: app.industry,
          verified: false,
          events: 0,
          followers: 0,
          location: app.location,
          email: app.email,
          phone: app.phone,
          shortBio: app.short_bio,
          longBio: app.long_bio,
          expertise: app.expertise,
          speakingTopics: app.topics,
        }));

        // Calculate stats
        const stats: AdminStats = {
          totalEvents: events.length,
          registrationsToday: 0, // Would need event_registrations query
          revenueThisMonth: 0, // Would need payment/registration data
          growthThisWeek: 0, // Would need historical data
        };

        // Transform ads
        const transformedAds: AdminAd[] = ads.map((ad) => ({
          id: ad.id,
          title: ad.title,
          impressions: ad.impressions,
          clicks: ad.clicks,
          activeUntil: ad.active_until,
          image: ad.image_url,
          link: ad.link,
          description: ad.description,
        }));

        return {
          stats,
          events: transformedEvents,
          categories: categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            color: cat.color,
          })),
          speakers: transformedSpeakers,
          ads: transformedAds,
        };
      },
    );
  },

  async createEvent(event: EventItem) {
    return withFallback(
      async () => {
        const { data } = await apiClient.post("/admin/events", event);
        return data;
      },
      async () => {
        // Use Supabase to create event
        const created = await supabaseService.events.create({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          category: event.category,
          price: event.isFree ? 0 : parseFloat(event.price.replace("$", "")),
          is_free: event.isFree,
          image_url: event.image,
          capacity: null,
          tags: [],
          is_online: true,
          online_link: null,
        });

        return {
          ...event,
          id: created.id,
        };
      },
    );
  },

  async updateCategory(id: number, updates: { name?: string; description?: string; color?: string }) {
    return withFallback(
      async () => {
        const { data } = await apiClient.put(`/admin/categories/${id}`, updates);
        return data;
      },
      async () => {
        // Use Supabase to update category
        return await supabaseService.admin.updateCategory(id, updates);
      },
    );
  },

  async createAd(ad: Partial<AdminAd> & { id: string }) {
    return withFallback(
      async () => {
        const { data } = await apiClient.post<AdminAd>("/admin/ads", ad);
        return data;
      },
      async () => {
        // Use Supabase to create ad
        const created = await supabaseService.admin.createAd({
          title: ad.title || "",
          image_url: ad.image,
          link: ad.link,
          description: ad.description,
          active_until: ad.activeUntil || new Date().toISOString().split('T')[0],
        });

        return {
          id: created.id,
          title: created.title || "",
          impressions: created.impressions,
          clicks: created.clicks,
          activeUntil: created.active_until,
          image: created.image_url,
          link: created.link,
          description: created.description,
        };
      },
    );
  },

  async updateAd(id: string, updates: Partial<AdminAd>) {
    return withFallback(
      async () => {
        const { data } = await apiClient.put<AdminAd>(`/admin/ads/${id}`, updates);
        return data;
      },
      async () => {
        // Use Supabase to update ad
        const updated = await supabaseService.admin.updateAd(id, {
          title: updates.title,
          image_url: updates.image,
          link: updates.link,
          description: updates.description,
          active_until: updates.activeUntil,
        });

        return {
          id: updated.id,
          title: updated.title || "",
          impressions: updated.impressions,
          clicks: updated.clicks,
          activeUntil: updated.active_until,
          image: updated.image_url,
          link: updated.link,
          description: updated.description,
        };
      },
    );
  },

  async deleteAd(id: string) {
    return withFallback(
      async () => {
        await apiClient.delete(`/admin/ads/${id}`);
        return { success: true };
      },
      async () => {
        // Use Supabase to delete ad
        await supabaseService.admin.deleteAd(id);
        return { success: true };
      },
    );
  },
};

