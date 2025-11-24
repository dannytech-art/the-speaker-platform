import type { EventItem } from "./event";
import type { SpeakerProfile } from "./speaker";

export interface AdminStats {
  totalEvents: number;
  registrationsToday: number;
  revenueThisMonth: number;
  growthThisWeek: number;
}

export interface AdminAd {
  id: string;
  title: string;
  impressions: number;
  clicks: number;
  activeUntil: string;
  image?: string;
  link?: string;
  description?: string;
}

export interface AdminCategory {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  events: EventItem[];
  categories: AdminCategory[];
  speakers: SpeakerProfile[]; // Pending speaker applications
  ads: AdminAd[];
}

