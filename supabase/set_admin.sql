-- Set Admin Role for User
-- Run this in Supabase SQL Editor

-- NOTE: Direct UPDATE of auth.users may not work in all Supabase setups
-- Method 1: Use user_metadata (works in SQL, less secure but functional)
-- Method 2: Use Supabase Dashboard UI (recommended - see ADMIN_SETUP.md)

-- ============================================
-- METHOD 1: Update user_metadata (SQL)
-- ============================================
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'my.guest.1app@gmail.com';

-- Also update raw_app_meta_data if available
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'my.guest.1app@gmail.com';

-- ============================================
-- METHOD 2: Check if app_metadata column exists first
-- ============================================
DO $$
BEGIN
  -- Try to update app_metadata if column exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND column_name = 'app_metadata'
  ) THEN
    EXECUTE '
      UPDATE auth.users
      SET app_metadata = jsonb_set(
        COALESCE(app_metadata, ''{}''::jsonb),
        ''{role}'',
        ''"admin"''
      )
      WHERE email = ''my.guest.1app@gmail.com'';
    ';
  END IF;
END $$;

-- ============================================
-- Verify the update
-- ============================================
SELECT 
  email,
  raw_user_meta_data->>'role' as role_from_user_meta,
  raw_app_meta_data->>'role' as role_from_app_meta,
  CASE 
    WHEN COALESCE(raw_app_meta_data->>'role', raw_user_meta_data->>'role') = 'admin' THEN '✅ Admin'
    WHEN COALESCE(raw_app_meta_data->>'role', raw_user_meta_data->>'role') = 'speaker' THEN '🎤 Speaker'
    ELSE '👤 User'
  END as status,
  created_at
FROM auth.users
WHERE email = 'my.guest.1app@gmail.com';

-- Optional: List all admin users
SELECT 
  email,
  COALESCE(raw_app_meta_data->>'role', raw_user_meta_data->>'role') as role,
  created_at
FROM auth.users
WHERE COALESCE(raw_app_meta_data->>'role', raw_user_meta_data->>'role') = 'admin'
ORDER BY created_at DESC;

