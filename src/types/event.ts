export type EventCategory = "Technology" | "Business" | "Leadership" | "Finance" | "Health" | "Education" | "Innovation";

export interface EventAgendaItem {
  time: string;
  title: string;
  speaker?: string | null;
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  image?: string;
}

export interface EventItem {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  price: string;
  isFree: boolean;
  category: EventCategory | string;
  speakers: string;
  attendees?: number;
  description?: string;
  agenda?: EventAgendaItem[];
  speakerProfiles?: EventSpeaker[];
}

export interface EventFilters {
  search?: string;
  category?: string;
  price?: "all" | "free" | "paid";
  date?: string;
}

export interface CreateEventPayload {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  price: number;
  image?: string;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {
  id: string;
}

export interface EventRegistrationPayload {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

