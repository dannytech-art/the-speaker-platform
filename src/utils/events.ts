// src/utils/events.ts
import eventsData from "@/data/events.json";
import type { EventItem, EventFilters } from "@/types/event";

// Get all events with optional filters
export const getEvents = (filters?: EventFilters): EventItem[] => {
  let events: EventItem[] = eventsData as EventItem[];

  if (filters?.category && filters.category !== "all") {
    events = events.filter(e => e.category === filters.category);
  }

  if (filters?.price && filters.price !== "all") {
    events = events.filter(e => (filters.price === "free" ? e.isFree : !e.isFree));
  }

  if (filters?.search) {
    const query = filters.search.toLowerCase();
    events = events.filter(
      e =>
        e.title.toLowerCase().includes(query) ||
        e.speakers.toLowerCase().includes(query)
    );
  }

  return events;
};

// Get single event by ID
export const getEventById = (id: string): EventItem | undefined => {
  return (eventsData as EventItem[]).find(event => event.id === id);
};
