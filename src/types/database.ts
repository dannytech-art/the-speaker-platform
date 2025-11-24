/**
 * Database types for Supabase
 * 
 * These types are generated from your Supabase database schema.
 * Update this file when your database schema changes.
 * 
 * To generate types automatically, use Supabase CLI:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          date: string;
          time: string;
          location: string;
          category: string;
          price: number;
          is_free: boolean;
          image_url: string | null;
          created_at: string;
          updated_at: string;
          speaker_ids: string[] | null;
          capacity: number | null;
          tags: string[] | null;
          organizer: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          website: string | null;
          registration_deadline: string | null;
          is_online: boolean | null;
          online_link: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          date: string;
          time: string;
          location: string;
          category: string;
          price?: number;
          is_free?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
          speaker_ids?: string[] | null;
          capacity?: number | null;
          tags?: string[] | null;
          organizer?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          website?: string | null;
          registration_deadline?: string | null;
          is_online?: boolean | null;
          online_link?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          date?: string;
          time?: string;
          location?: string;
          category?: string;
          price?: number;
          is_free?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
          speaker_ids?: string[] | null;
          capacity?: number | null;
          tags?: string[] | null;
          organizer?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          website?: string | null;
          registration_deadline?: string | null;
          is_online?: boolean | null;
          online_link?: string | null;
        };
      };
      speakers: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          location: string;
          title: string;
          industry: string;
          expertise: string[];
          short_bio: string;
          long_bio: string;
          headshot_url: string | null;
          website: string | null;
          linkedin: string | null;
          twitter: string | null;
          facebook: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
          sample_video_url: string | null;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          location: string;
          title: string;
          industry: string;
          expertise: string[];
          short_bio: string;
          long_bio: string;
          headshot_url?: string | null;
          website?: string | null;
          linkedin?: string | null;
          twitter?: string | null;
          facebook?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
          sample_video_url?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          location?: string;
          title?: string;
          industry?: string;
          expertise?: string[];
          short_bio?: string;
          long_bio?: string;
          headshot_url?: string | null;
          website?: string | null;
          linkedin?: string | null;
          twitter?: string | null;
          facebook?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
          sample_video_url?: string | null;
        };
      };
      event_speakers: {
        Row: {
          id: string;
          event_id: string;
          speaker_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          speaker_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          speaker_id?: string;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          description: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          color?: string;
          created_at?: string;
        };
      };
      user_saved_events: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          created_at?: string;
        };
      };
      user_following_speakers: {
        Row: {
          id: string;
          user_id: string;
          speaker_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          speaker_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          speaker_id?: string;
          created_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string | null;
          name?: string;
          email?: string;
          phone?: string | null;
          created_at?: string;
        };
      };
      advertisements: {
        Row: {
          id: string;
          title: string;
          image_url: string | null;
          link: string | null;
          description: string | null;
          impressions: number;
          clicks: number;
          active_until: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image_url?: string | null;
          link?: string | null;
          description?: string | null;
          impressions?: number;
          clicks?: number;
          active_until: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          image_url?: string | null;
          link?: string | null;
          description?: string | null;
          impressions?: number;
          clicks?: number;
          active_until?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      speaker_applications: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          location: string;
          title: string;
          industry: string;
          expertise: string[];
          short_bio: string;
          long_bio: string;
          headshot_url: string;
          website: string | null;
          linkedin: string | null;
          twitter: string | null;
          facebook: string | null;
          experience: string | null;
          sample_video: string | null;
          topics: string[];
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          location: string;
          title: string;
          industry: string;
          expertise: string[];
          short_bio: string;
          long_bio: string;
          headshot_url: string;
          website?: string | null;
          linkedin?: string | null;
          twitter?: string | null;
          facebook?: string | null;
          experience?: string | null;
          sample_video?: string | null;
          topics: string[];
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          location?: string;
          title?: string;
          industry?: string;
          expertise?: string[];
          short_bio?: string;
          long_bio?: string;
          headshot_url?: string;
          website?: string | null;
          linkedin?: string | null;
          twitter?: string | null;
          facebook?: string | null;
          experience?: string | null;
          sample_video?: string | null;
          topics?: string[];
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
      };
    };
    Views: {
      // Add views here as needed
    };
    Functions: {
      // Add functions here as needed
    };
    Enums: {
      // Add enums here as needed
    };
  };
}

