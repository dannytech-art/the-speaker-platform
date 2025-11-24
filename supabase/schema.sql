-- Africa Speaks Connect - Database Schema
-- This schema should be run in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SPEAKERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  location VARCHAR(200) NOT NULL,
  title VARCHAR(200) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  expertise TEXT[] NOT NULL DEFAULT '{}',
  short_bio VARCHAR(500) NOT NULL,
  long_bio TEXT NOT NULL,
  headshot_url TEXT,
  website TEXT,
  linkedin TEXT,
  twitter VARCHAR(100),
  facebook TEXT,
  verified BOOLEAN DEFAULT FALSE,
  sample_video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  speaker_ids UUID[] DEFAULT '{}',
  capacity INTEGER,
  tags TEXT[] DEFAULT '{}',
  organizer VARCHAR(200),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  website TEXT,
  registration_deadline DATE,
  is_online BOOLEAN DEFAULT TRUE,
  online_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- EVENT SPEAKERS (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS event_speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  speaker_id UUID NOT NULL REFERENCES speakers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, speaker_id)
);

-- ============================================
-- USER SAVED EVENTS
-- ============================================
CREATE TABLE IF NOT EXISTS user_saved_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- References auth.users(id)
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- ============================================
-- USER FOLLOWING SPEAKERS
-- ============================================
CREATE TABLE IF NOT EXISTS user_following_speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- References auth.users(id)
  speaker_id UUID NOT NULL REFERENCES speakers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, speaker_id)
);

-- ============================================
-- EVENT REGISTRATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID, -- References auth.users(id), nullable for guest registrations
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, email) -- Prevent duplicate registrations from same email
);

-- ============================================
-- ADVERTISEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  image_url TEXT,
  link TEXT,
  description TEXT,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  active_until DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SPEAKER APPLICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS speaker_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  title VARCHAR(200) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  expertise TEXT[] NOT NULL DEFAULT '{}',
  short_bio VARCHAR(500) NOT NULL,
  long_bio TEXT NOT NULL,
  headshot_url TEXT NOT NULL,
  website TEXT,
  linkedin TEXT,
  twitter VARCHAR(100),
  facebook TEXT,
  experience TEXT,
  sample_video TEXT,
  topics TEXT[] NOT NULL DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_speaker_ids ON events USING GIN(speaker_ids);
CREATE INDEX IF NOT EXISTS idx_event_speakers_event_id ON event_speakers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_speakers_speaker_id ON event_speakers(speaker_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_events_user_id ON user_saved_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_following_speakers_user_id ON user_following_speakers(user_id);
CREATE INDEX IF NOT EXISTS idx_speakers_verified ON speakers(verified);
CREATE INDEX IF NOT EXISTS idx_speakers_industry ON speakers(industry);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_speaker_applications_status ON speaker_applications(status);

-- ============================================
-- FUNCTIONS for Updated At
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS for Updated At
-- ============================================
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_speakers_updated_at
  BEFORE UPDATE ON speakers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertisements_updated_at
  BEFORE UPDATE ON advertisements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_following_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaker_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_speakers ENABLE ROW LEVEL SECURITY;

-- Events: Public read, authenticated write
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Events are insertable by authenticated users" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Events are updatable by authenticated users" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Speakers: Public read, authenticated write
CREATE POLICY "Speakers are viewable by everyone" ON speakers
  FOR SELECT USING (true);

CREATE POLICY "Speakers are insertable by authenticated users" ON speakers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Categories: Public read, authenticated write
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are insertable by authenticated users" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User saved events: Users can only see/modify their own
CREATE POLICY "Users can view their own saved events" ON user_saved_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved events" ON user_saved_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved events" ON user_saved_events
  FOR DELETE USING (auth.uid() = user_id);

-- User following speakers: Users can only see/modify their own
CREATE POLICY "Users can view their own following" ON user_following_speakers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own following" ON user_following_speakers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own following" ON user_following_speakers
  FOR DELETE USING (auth.uid() = user_id);

-- Event registrations: Public insert (for guest registration), users can see their own
CREATE POLICY "Event registrations are insertable by everyone" ON event_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own registrations" ON event_registrations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Advertisements: Public read, authenticated write (admin only in practice)
CREATE POLICY "Advertisements are viewable by everyone" ON advertisements
  FOR SELECT USING (true);

CREATE POLICY "Advertisements are insertable by authenticated users" ON advertisements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Advertisements are updatable by authenticated users" ON advertisements
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Speaker applications: Public insert, authenticated read
CREATE POLICY "Speaker applications are insertable by everyone" ON speaker_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Speaker applications are viewable by authenticated users" ON speaker_applications
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
  ('Technology', 'Tech and innovation events', '#6366f1'),
  ('Leadership', 'Leadership and management', '#8b5cf6'),
  ('Finance', 'Finance and investment', '#10b981'),
  ('Business', 'Business and entrepreneurship', '#f59e0b'),
  ('Politics', 'Political discussions', '#ef4444'),
  ('Government', 'Government and governance', '#3b82f6'),
  ('Education', 'Education and learning', '#14b8a6'),
  ('Health', 'Health and wellness', '#ec4899'),
  ('Entertainment', 'Entertainment and media', '#f97316'),
  ('Entrepreneurship', 'Startups and entrepreneurship', '#84cc16')
ON CONFLICT (name) DO NOTHING;

