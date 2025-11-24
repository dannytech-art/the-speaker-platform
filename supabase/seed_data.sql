-- Africa Speaks Connect - Seed Data
-- This file contains dummy data for testing: 5 users, 5 speakers, 5 events
-- Run this AFTER running schema.sql in your Supabase SQL Editor

-- ============================================
-- IMPORTANT: USER CREATION
-- ============================================
-- Users must be created via Supabase Auth first (using the frontend registration)
-- After users are created in auth.users, you can manually link them to the users table
-- OR create them directly via SQL if you know their auth.users.id

-- For testing, you can create test users via Supabase Auth UI:
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Click "Add user" and create 5 users
-- 3. Copy their UUIDs and use them below

-- OR use Supabase CLI:
-- supabase auth admin create-user --email user1@example.com --password password123

-- ============================================
-- USERS TABLE (if exists - optional profile table)
-- ============================================
-- Note: The schema uses auth.users directly, but you can create a users profile table:
-- CREATE TABLE IF NOT EXISTS users (
--   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   name VARCHAR(200) NOT NULL,
--   email VARCHAR(255) NOT NULL,
--   role VARCHAR(20) DEFAULT 'user',
--   avatar_url TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Replace these UUIDs with actual auth.users.id after creating users
-- For now, using placeholder UUIDs that you should replace:
/*
INSERT INTO users (id, name, email, role) VALUES
('00000000-0000-0000-0000-000000000001', 'John Doe', 'john.doe@example.com', 'user'),
('00000000-0000-0000-0000-000000000002', 'Jane Smith', 'jane.smith@example.com', 'user'),
('00000000-0000-0000-0000-000000000003', 'Mike Johnson', 'mike.johnson@example.com', 'user'),
('00000000-0000-0000-0000-000000000004', 'Sarah Williams', 'sarah.williams@example.com', 'speaker'),
('00000000-0000-0000-0000-000000000005', 'Admin User', 'admin@example.com', 'admin')
ON CONFLICT (id) DO NOTHING;
*/

-- ============================================
-- SPEAKERS (5 speakers)
-- ============================================
INSERT INTO speakers (
  id, first_name, last_name, email, phone, location, title, industry, 
  expertise, short_bio, long_bio, headshot_url, website, linkedin, twitter, 
  verified, created_at
) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Amara',
  'Okafor',
  'amara.okafor@example.com',
  '+234 800 123 4567',
  'Lagos, Nigeria',
  'Tech Innovation Leader',
  'Technology',
  ARRAY['Artificial Intelligence', 'Digital Transformation', 'Innovation Strategy'],
  'Tech innovation leader with 15+ years driving digital transformation across African markets.',
  'Dr. Amara Okafor is a renowned technology leader with over 15 years of experience driving innovation across African markets. She specializes in AI, digital transformation, and helping startups scale.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'https://amaraokafor.com',
  'https://linkedin.com/in/amaraokafor',
  'amaraokafor',
  true,
  NOW()
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Kwame',
  'Mensah',
  'kwame.mensah@example.com',
  '+233 244 123 456',
  'Accra, Ghana',
  'Business Strategy Expert',
  'Business',
  ARRAY['Business Strategy', 'Market Expansion', 'Entrepreneurship'],
  'Business strategy expert specializing in African market expansion and startup growth.',
  'Kwame Mensah is a seasoned business strategist with extensive experience helping African businesses expand across the continent. He has consulted for over 50 startups and enterprises.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  'https://kwamemensah.com',
  'https://linkedin.com/in/kwamemensah',
  'kwamemensah',
  true,
  NOW()
),
(
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'Zainab',
  'Adeyemi',
  'zainab.adeyemi@example.com',
  '+234 802 345 6789',
  'Abuja, Nigeria',
  'Leadership Coach',
  'Leadership',
  ARRAY['Leadership Development', 'Executive Coaching', 'Organizational Change'],
  'Leadership coach with expertise in developing executive talent across African organizations.',
  'Zainab Adeyemi is a certified leadership coach who has trained hundreds of executives across Africa. She focuses on developing authentic leadership and organizational transformation.',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  'https://zainabadeyemi.com',
  'https://linkedin.com/in/zainabadeyemi',
  'zainabadeyemi',
  true,
  NOW()
),
(
  'd4e5f6a7-b8c9-0123-defa-234567890123',
  'David',
  'Kimani',
  'david.kimani@example.com',
  '+254 712 345 678',
  'Nairobi, Kenya',
  'Financial Advisor',
  'Finance',
  ARRAY['Investment Strategy', 'Financial Planning', 'Wealth Management'],
  'Financial advisor helping individuals and businesses build wealth across East Africa.',
  'David Kimani is a certified financial advisor with a track record of helping clients achieve their financial goals. He specializes in investment strategy and wealth management.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://davidkimani.com',
  'https://linkedin.com/in/davidkimani',
  'davidkimani',
  true,
  NOW()
),
(
  'e5f6a7b8-c9d0-1234-efab-345678901234',
  'Amina',
  'Hassan',
  'amina.hassan@example.com',
  '+255 713 456 789',
  'Dar es Salaam, Tanzania',
  'Marketing Strategist',
  'Business',
  ARRAY['Digital Marketing', 'Brand Strategy', 'Content Marketing'],
  'Marketing strategist helping African brands reach global audiences through digital channels.',
  'Amina Hassan is a digital marketing expert who has helped numerous African brands establish a strong online presence and reach international markets through strategic marketing campaigns.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  'https://aminahassan.com',
  'https://linkedin.com/in/aminahassan',
  'aminahassan',
  true,
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- EVENTS (5 events)
-- ============================================
INSERT INTO events (
  id, title, description, date, time, location, category, price, is_free,
  image_url, speaker_ids, capacity, tags, organizer, contact_email, 
  contact_phone, website, is_online, online_link, created_at
) VALUES
(
  'f1a2b3c4-d5e6-7890-1234-567890abcdef',
  'African Tech Innovation Summit 2024',
  'Join Africa''s premier tech innovation summit where industry leaders, entrepreneurs, and innovators discuss the future of technology across the continent. Featuring keynote presentations, panel discussions, and networking opportunities.',
  '2024-12-15',
  '10:00 AM WAT',
  'Online',
  'Technology',
  0.00,
  true,
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  ARRAY['a1b2c3d4-e5f6-7890-abcd-ef1234567890']::uuid[],
  1000,
  ARRAY['Technology', 'Innovation', 'Startups', 'AI'],
  'Africa Tech Community',
  'events@africatech.com',
  '+234 800 111 2222',
  'https://africatechsummit.com',
  true,
  'https://zoom.us/j/africatechsummit',
  NOW()
),
(
  'a2b3c4d5-e6f7-8901-2345-678901bcdefa',
  'Leadership & Governance Masterclass',
  'An intensive masterclass on leadership and governance for African executives. Learn from top leadership coaches about building effective teams, making strategic decisions, and driving organizational change.',
  '2024-12-20',
  '02:00 PM WAT',
  'Hybrid (Online & Lagos)',
  'Leadership',
  49.00,
  false,
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
  ARRAY['c3d4e5f6-a7b8-9012-cdef-123456789012']::uuid[],
  200,
  ARRAY['Leadership', 'Management', 'Governance'],
  'Leadership Institute Africa',
  'info@leadershipafrica.com',
  '+234 802 222 3333',
  'https://leadershipafrica.com',
  true,
  'https://zoom.us/j/leadershipmasterclass',
  NOW()
),
(
  'b3c4d5e6-f7a8-9012-3456-789012cdefab',
  'Finance & Investment Summit',
  'Connect with leading financial advisors and investors. Learn about investment opportunities across Africa, wealth management strategies, and financial planning for businesses and individuals.',
  '2024-12-25',
  '11:00 AM EAT',
  'Online',
  'Finance',
  79.00,
  false,
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  ARRAY['d4e5f6a7-b8c9-0123-defa-234567890123']::uuid[],
  500,
  ARRAY['Finance', 'Investment', 'Wealth Management'],
  'African Finance Forum',
  'summit@africanfinance.com',
  '+254 712 333 4444',
  'https://africanfinancesummit.com',
  true,
  'https://zoom.us/j/financesummit',
  NOW()
),
(
  'c4d5e6f7-a8b9-0123-4567-890123defabc',
  'Digital Marketing for African Businesses',
  'Master digital marketing strategies tailored for African markets. Learn from experts about social media marketing, content creation, SEO, and building an online presence that drives results.',
  '2024-12-28',
  '03:00 PM EAT',
  'Online',
  'Business',
  0.00,
  true,
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
  ARRAY['e5f6a7b8-c9d0-1234-efab-345678901234']::uuid[],
  300,
  ARRAY['Marketing', 'Digital', 'Business Growth'],
  'Digital Marketing Africa',
  'workshop@digitalmarketingafrica.com',
  '+255 713 444 5555',
  'https://digitalmarketingafrica.com',
  true,
  'https://zoom.us/j/digitalmarketing',
  NOW()
),
(
  'd5e6f7a8-b9c0-1234-5678-901234efabcd',
  'AI & Machine Learning in Africa',
  'Explore the latest developments in AI and machine learning across Africa. Discover how African companies are leveraging AI to solve local challenges and compete globally.',
  '2025-01-02',
  '11:00 AM WAT',
  'Online',
  'Technology',
  99.00,
  false,
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
  ARRAY['a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b2c3d4e5-f6a7-8901-bcde-f12345678901']::uuid[],
  800,
  ARRAY['AI', 'Machine Learning', 'Technology', 'Innovation'],
  'AI Africa Network',
  'events@aiafrica.com',
  '+234 803 555 6666',
  'https://aiafricanetwork.com',
  true,
  'https://zoom.us/j/aiafrica',
  NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================
-- EVENT SPEAKERS (Junction Table)
-- ============================================
INSERT INTO event_speakers (event_id, speaker_id) VALUES
('f1a2b3c4-d5e6-7890-1234-567890abcdef', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
('a2b3c4d5-e6f7-8901-2345-678901bcdefa', 'c3d4e5f6-a7b8-9012-cdef-123456789012'),
('b3c4d5e6-f7a8-9012-3456-789012cdefab', 'd4e5f6a7-b8c9-0123-defa-234567890123'),
('c4d5e6f7-a8b9-0123-4567-890123defabc', 'e5f6a7b8-c9d0-1234-efab-345678901234'),
('d5e6f7a8-b9c0-1234-5678-901234efabcd', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
('d5e6f7a8-b9c0-1234-5678-901234efabcd', 'b2c3d4e5-f6a7-8901-bcde-f12345678901')
ON CONFLICT (event_id, speaker_id) DO NOTHING;

-- ============================================
-- NOTES
-- ============================================
-- 1. USERS: Create users via Supabase Auth first, then optionally link to users table
-- 2. All UUIDs above are examples - they will be auto-generated if not provided
-- 3. Run this file AFTER schema.sql in Supabase SQL Editor
-- 4. You can modify the data as needed for your testing

