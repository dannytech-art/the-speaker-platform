import type { EventItem } from "./event";

export interface SpeakerProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  title: string;
  image: string;
  industry: string;
  verified: boolean;
  events: number;
  followers: number;
  location?: string;
  email?: string;
  phone?: string;
  rating?: number;
  shortBio?: string;
  longBio?: string;
  expertise?: string[];
  speakingTopics?: string[];
  previousExperience?: string;
  sampleVideoUrl?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export interface SpeakerFilters {
  search?: string;
  industry?: string;
  verified?: boolean;
}

export interface SpeakerApplicationPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  industry: string;
  expertise: string[];
  shortBio: string;
  longBio: string;
  headshot: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  experience?: string;
  sampleVideo?: string;
  topics: string[];
}

export interface SpeakerDashboardStats {
  totalEvents: number;
  followers: number;
  profileViews: number;
  rating: number;
}

export interface SpeakerInvitation {
  id: string;
  title: string;
  date: string;
  organizer: string;
  status: "pending" | "accepted" | "declined";
}

export interface SpeakerDashboardData {
  stats: SpeakerDashboardStats;
  upcomingEvents: EventItem[];
  invitations: SpeakerInvitation[];
}

