import { apiClient } from "@/services/api/apiClient";
import { supabaseService } from "@/services/supabaseService";
import type {
  CreateEventPayload,
  EventFilters,
  EventItem,
  EventRegistrationPayload,
  UpdateEventPayload,
} from "@/types/event";

const applyFilters = (events: EventItem[], filters?: EventFilters) => {
  if (!filters) return events;
  return events.filter((event) => {
    const matchesSearch =
      !filters.search ||
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.speakers?.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.category.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory = !filters.category || filters.category === "all" || event.category === filters.category;

    const matchesPrice =
      !filters.price ||
      filters.price === "all" ||
      (filters.price === "free" && event.isFree) ||
      (filters.price === "paid" && !event.isFree);

    return matchesSearch && matchesCategory && matchesPrice;
  });
};

const transformEventToItem = (event: any): EventItem => ({
  id: event.id,
  title: event.title,
  image: event.image_url || "",
  date: event.date,
  time: event.time,
  location: event.location,
  price: event.is_free ? "Free" : `$${event.price}`,
  isFree: event.is_free,
  category: event.category,
  speakers: "", // Will be populated separately if needed
  description: event.description || "",
  attendees: 0, // Would need to count registrations
});

const withFallback = async <T>(request: () => Promise<T>, fallback: () => Promise<T>) => {
  try {
    return await request();
  } catch (error) {
    console.warn("[eventService] API request failed, trying Supabase", error);
    return fallback();
  }
};

export const eventService = {
  async list(filters?: EventFilters): Promise<EventItem[]> {
    return withFallback(
      async () => {
        const { data } = await apiClient.get<EventItem[]>("/events", { query: filters as Record<string, string> });
        return data;
      },
      async () => {
        const events = await supabaseService.events.list({
          search: filters?.search,
          category: filters?.category === "all" ? undefined : filters?.category,
          isFree: filters?.price === "free" ? true : filters?.price === "paid" ? false : undefined,
        });
        const transformed = events.map(transformEventToItem);
        return applyFilters(transformed, filters);
      },
    );
  },

  async getById(id: string): Promise<EventItem | null> {
    return withFallback(
      async () => {
        const { data } = await apiClient.get<EventItem>(`/events/${id}`);
        return data;
      },
      async () => {
        const event = await supabaseService.events.getById(id);
        return event ? transformEventToItem(event) : null;
      },
    );
  },

  async create(payload: CreateEventPayload): Promise<EventItem> {
    return withFallback(
      async () => {
        const { data } = await apiClient.post<EventItem>("/events", payload);
        return data;
      },
      async () => {
        const created = await supabaseService.events.create({
          title: payload.title,
          description: payload.description,
          date: payload.date,
          time: payload.time,
          location: payload.location,
          category: payload.category,
          price: payload.price || 0,
          is_free: !payload.price,
          image_url: payload.image,
          capacity: null,
          tags: [],
          is_online: true,
          online_link: null,
        });
        return transformEventToItem(created);
      },
    );
  },

  async update(payload: UpdateEventPayload): Promise<EventItem> {
    return withFallback(
      async () => {
        const { id, ...rest } = payload;
        const { data } = await apiClient.put<EventItem>(`/events/${id}`, rest);
        return data;
      },
      async () => {
        const { id, ...updates } = payload;
        const updated = await supabaseService.events.update(id, {
          title: updates.title,
          description: updates.description,
          date: updates.date,
          time: updates.time,
          location: updates.location,
          category: updates.category,
          price: updates.price || 0,
          is_free: updates.price ? updates.price === 0 : undefined,
          image_url: updates.image,
        });
        return transformEventToItem(updated);
      },
    );
  },

  async remove(id: string): Promise<void> {
    return withFallback(
      async () => {
        await apiClient.delete(`/events/${id}`);
      },
      async () => {
        await supabaseService.events.delete(id);
      },
    );
  },

  async register(payload: EventRegistrationPayload) {
    return withFallback(
      async () => {
        await apiClient.post(`/events/${payload.id}/register`, payload);
        return { success: true };
      },
      async () => {
        await supabaseService.events.register(payload.id, {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
        });
        return { success: true };
      },
    );
  },
};

