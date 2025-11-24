import { apiClient } from "@/services/api/apiClient";
import { supabaseService } from "@/services/supabaseService";
import type { SpeakerApplicationPayload, SpeakerDashboardData, SpeakerFilters, SpeakerProfile } from "@/types/speaker";
import type { EventItem } from "@/types/event";

const transformSpeakerToProfile = (speaker: any): SpeakerProfile => ({
  id: speaker.id,
  name: `${speaker.first_name} ${speaker.last_name}`,
  firstName: speaker.first_name,
  lastName: speaker.last_name,
  title: speaker.title,
  image: speaker.headshot_url || "",
  industry: speaker.industry,
  verified: speaker.verified,
  events: 0, // Would need to count from event_speakers table
  followers: 0, // Would need to count from user_following_speakers table
  location: speaker.location,
  email: speaker.email,
  phone: speaker.phone || "",
  rating: 0, // Would need rating system
  shortBio: speaker.short_bio,
  longBio: speaker.long_bio,
  expertise: speaker.expertise || [],
  speakingTopics: [], // Would need separate field
  previousExperience: "", // Would need separate field
  socialLinks: {
    website: speaker.website,
    linkedin: speaker.linkedin,
    twitter: speaker.twitter,
    facebook: speaker.facebook,
  },
});

const withFallback = async <T>(request: () => Promise<T>, fallback: () => Promise<T>) => {
  try {
    return await request();
  } catch (error) {
    console.warn("[speakerService] API request failed, trying Supabase", error);
    return fallback();
  }
};

const filterSpeakers = (speakers: SpeakerProfile[], filters?: SpeakerFilters) => {
  if (!filters) return speakers;
  return speakers.filter((speaker) => {
    const matchesSearch =
      !filters.search ||
      speaker.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      speaker.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      speaker.industry.toLowerCase().includes(filters.search.toLowerCase());

    const matchesIndustry = !filters.industry || filters.industry === "all" || speaker.industry === filters.industry;
    const matchesVerified = filters.verified === undefined || speaker.verified === filters.verified;

    return matchesSearch && matchesIndustry && matchesVerified;
  });
};

export const speakerService = {
  async list(filters?: SpeakerFilters): Promise<SpeakerProfile[]> {
    return withFallback(
      async () => {
        const { data } = await apiClient.get<SpeakerProfile[]>("/speakers", { query: filters as Record<string, string> });
        return data;
      },
      async () => {
        const speakers = await supabaseService.speakers.list({
          search: filters?.search,
          industry: filters?.industry === "all" ? undefined : filters?.industry,
          verified: filters?.verified,
        });
        const transformed = speakers.map(transformSpeakerToProfile);
        return filterSpeakers(transformed, filters);
      },
    );
  },

  async getById(id: string): Promise<SpeakerProfile | null> {
    return withFallback(
      async () => {
        const { data } = await apiClient.get<SpeakerProfile>(`/speakers/${id}`);
        return data;
      },
      async () => {
        const speaker = await supabaseService.speakers.getById(id);
        return speaker ? transformSpeakerToProfile(speaker) : null;
      },
    );
  },

  async apply(payload: SpeakerApplicationPayload) {
    return withFallback(
      async () => {
        const { data } = await apiClient.post("/speakers/apply", payload);
        return data;
      },
      async () => {
        const created = await supabaseService.speakers.apply({
          first_name: payload.firstName,
          last_name: payload.lastName,
          email: payload.email,
          phone: payload.phone,
          location: payload.location,
          title: payload.title,
          industry: payload.industry,
          expertise: payload.expertise || [],
          short_bio: payload.shortBio,
          long_bio: payload.longBio,
          headshot_url: payload.headshot,
          website: payload.website,
          linkedin: payload.linkedin,
          twitter: payload.twitter,
          facebook: payload.facebook,
          experience: payload.experience,
          sample_video: payload.sampleVideo,
          topics: payload.topics || [],
          status: "pending",
        });
        return transformSpeakerToProfile(created);
      },
    );
  },

  async follow(id: string) {
    return withFallback(
      async () => {
        const { data } = await apiClient.post(`/speakers/${id}/follow`);
        return data;
      },
      async () => {
        // Get current user ID from auth session
        const { supabase } = await import("@/lib/supabase");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        
        await supabaseService.speakers.follow(user.id, id);
        return { success: true };
      },
    );
  },

  async unfollow(id: string) {
    return withFallback(
      async () => {
        const { data } = await apiClient.post(`/speakers/${id}/unfollow`);
        return data;
      },
      async () => {
        // Get current user ID from auth session
        const { supabase } = await import("@/lib/supabase");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        
        await supabaseService.speakers.unfollow(user.id, id);
        return { success: true };
      },
    );
  },

  async getDashboard(): Promise<SpeakerDashboardData> {
    return withFallback(
      async () => {
        const { data } = await apiClient.get<SpeakerDashboardData>("/speakers/dashboard");
        return data;
      },
      async () => {
        // Return empty dashboard - would need to implement with Supabase
        return {
          stats: {
            totalEvents: 0,
            followers: 0,
            profileViews: 0,
            rating: 0,
          },
          upcomingEvents: [],
          invitations: [],
        };
      },
    );
  },

  async getFollowingStatus(id: string): Promise<boolean> {
    return withFallback(
      async () => {
        const { data } = await apiClient.get<{ following: boolean }>(`/speakers/${id}/following-status`);
        return data.following;
      },
      async () => {
        // Get current user ID from auth session
        const { supabase } = await import("@/lib/supabase");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        
        return await supabaseService.speakers.getFollowingStatus(user.id, id);
      },
    );
  },

  async getSpeakerEvents(id: string): Promise<EventItem[]> {
    return withFallback(
      async () => {
        const { data } = await apiClient.get<EventItem[]>(`/speakers/${id}/events`);
        return data;
      },
      async () => {
        const events = await supabaseService.speakers.getSpeakerEvents(id);
        return events.map((event: any) => ({
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
        }));
      },
    );
  },
};

