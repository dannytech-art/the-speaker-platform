# 🔐 Admin User Setup Guide

How to set up admin users and log in as admin in Supabase.

---

## 📋 Method 1: Using Supabase Dashboard (Easiest)

### Step 1: Find Your User

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Users**
4. Search for `my.guest.1app@gmail.com`
5. Click on the user to open details

### Step 2: Set Admin Role

1. In the user details page, scroll to **User Metadata** section
2. Click **Edit** or **Add Metadata**
3. Add to **App Metadata** (NOT User Metadata):
   ```json
   {
     "role": "admin"
   }
   ```
4. Click **Save**

**Note:** App Metadata is for role/permissions. User Metadata is for profile data (name, avatar, etc.).

---

## 📋 Method 2: Using SQL (Recommended for Batch Updates)

### Option A: Update Using user_metadata (Works in SQL)

Run this in Supabase **SQL Editor** (use `supabase/set_admin.sql`):

```sql
-- Update user_metadata (accessible via SQL)
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'my.guest.1app@gmail.com';

-- Also update raw_app_meta_data if available
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'my.guest.1app@gmail.com';

-- Verify the update
SELECT 
  email,
  raw_user_meta_data->>'role' as role_from_user_meta,
  raw_app_meta_data->>'role' as role_from_app_meta
FROM auth.users
WHERE email = 'my.guest.1app@gmail.com';
```

**Note:** The app checks both `app_metadata.role` and `user_metadata.role`, so either works!

### Option B: Set Admin Role During User Creation

If creating a new user:

```sql
-- Create user with admin role (requires Supabase Admin API or Dashboard)
-- OR use SQL after creation:
UPDATE auth.users
SET app_metadata = jsonb_build_object('role', 'admin')
WHERE email = 'my.guest.1app@gmail.com';
```

### Option C: Set Multiple Users as Admin

```sql
-- Set multiple users as admin
UPDATE auth.users
SET app_metadata = jsonb_set(
  COALESCE(app_metadata, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email IN (
  'my.guest.1app@gmail.com',
  'another.admin@example.com'
);
```

---

## 🔍 Verify Admin Role

### Check User Role (SQL)

```sql
SELECT 
  id,
  email,
  app_metadata->>'role' as role,
  user_metadata->>'name' as name,
  created_at
FROM auth.users
WHERE email = 'my.guest.1app@gmail.com';
```

### Expected Output:
```
id                                   | email                  | role  | name
-------------------------------------|------------------------|-------|-------
abc123...                            | my.guest.1app@gmail.com | admin | ...
```

---

## 🚪 How to Log In as Admin

### Step 1: Register/Login User

1. Go to your app: `http://localhost:5173` (or your dev URL)
2. Go to `/auth` page
3. If user doesn't exist:
   - Click **Sign Up** tab
   - Email: `my.guest.1app@gmail.com`
   - Password: (choose a password)
   - Name: (your name)
   - Click **Sign Up**
4. If user exists:
   - Click **Sign In** tab
   - Email: `my.guest.1app@gmail.com`
   - Password: (your password)
   - Click **Sign In**

### Step 2: Access Admin Dashboard

1. After login, you should be redirected to `/dashboard`
2. Navigate to `/admin` or `/admin-dashboard`
3. If you have admin role, you'll see the admin dashboard
4. If not, you'll see an "Access Denied" message

---

## 🔒 Admin Route Protection

The app checks for admin role in:

**File:** `src/components/auth/RouteGuards.tsx`

```typescript
// Admin route check
if (routeRequiresAdmin && user?.role !== "admin") {
  // Redirect to dashboard or show access denied
}
```

**Role Check:** The role is read from:
- `app_metadata.role` (preferred)
- `user_metadata.role` (fallback)
- Defaults to `"user"` if neither exists

---

## 📝 Complete Setup Script

Run this complete SQL script to set up admin:

```sql
-- Step 1: Create user via Auth if needed (or create via Dashboard first)
-- Then set role:

-- Step 2: Set admin role
UPDATE auth.users
SET app_metadata = jsonb_set(
  COALESCE(app_metadata, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'my.guest.1app@gmail.com';

-- Step 3: Verify
SELECT 
  email,
  app_metadata->>'role' as role,
  CASE 
    WHEN app_metadata->>'role' = 'admin' THEN '✅ Admin'
    WHEN app_metadata->>'role' = 'speaker' THEN '🎤 Speaker'
    ELSE '👤 User'
  END as status
FROM auth.users
WHERE email = 'my.guest.1app@gmail.com';

-- Step 4: Check all admin users
SELECT email, app_metadata->>'role' as role
FROM auth.users
WHERE app_metadata->>'role' = 'admin';
```

---

## 🛠️ Troubleshooting

### Issue: User shows as "user" instead of "admin"

**Solution:**
1. Verify app_metadata is set correctly:
   ```sql
   SELECT app_metadata FROM auth.users WHERE email = 'my.guest.1app@gmail.com';
   ```
2. Should return: `{"role": "admin"}`
3. If not, update again with SQL above
4. **Log out and log back in** - role is cached in session

### Issue: Cannot access admin dashboard

**Solutions:**
1. Clear browser cache/localStorage
2. Log out completely
3. Log back in
4. Check browser console for role in user object

### Issue: Role not updating after SQL

**Solution:**
1. The user needs to **log out and log back in**
2. Or clear session: In browser console:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

---

## 📋 Quick Reference

| Task | Method |
|------|--------|
| Set single user as admin | Dashboard → Auth → Users → Edit → App Metadata |
| Set multiple users | SQL: `UPDATE auth.users SET app_metadata = ...` |
| Check user role | SQL: `SELECT app_metadata->>'role' FROM auth.users` |
| List all admins | SQL: `SELECT email FROM auth.users WHERE app_metadata->>'role' = 'admin'` |

---

## 🔐 Security Notes

1. **App Metadata** is server-side only - clients cannot modify it
2. **User Metadata** can be updated by users (not recommended for roles)
3. Always use **App Metadata** for roles/permissions
4. Admin routes are protected client-side AND should be protected server-side with RLS policies

---

## ✅ After Setup

1. ✅ User `my.guest.1app@gmail.com` has role set to `admin`
2. ✅ User can log in at `/auth`
3. ✅ User can access `/admin` or `/admin-dashboard`
4. ✅ Admin features are available (event management, speaker management, etc.)

---

**Need Help?** Check:
- Supabase Dashboard → Authentication → Users
- Browser Console for user object
- Network tab for auth responses

