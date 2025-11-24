import type { EventItem } from "./event";

export interface SavedEventSummary {
  id: string;
  title: string;
  date: string;
  image: string;
}

export interface DashboardStats {
  registeredEvents: number;
  savedEvents: number;
  followingSpeakers: number;
  pastEvents: number;
}

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
  type: "event" | "speaker" | "reminder";
}

export interface DashboardData {
  stats: DashboardStats;
  upcomingEvents: EventItem[];
  savedEvents: SavedEventSummary[];
  notifications: NotificationItem[];
}

