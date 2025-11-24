# 🚀 Supabase Setup Guide

**Africa Speaks Connect - Complete Supabase Integration**

This guide will walk you through setting up Supabase as your database backend.

---

## 📋 What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- ✅ **PostgreSQL Database** - Fully managed, powerful SQL database
- ✅ **Real-time Subscriptions** - Live data updates
- ✅ **Authentication** (Optional) - User management built-in
- ✅ **Storage** (Optional) - File uploads and media
- ✅ **Row Level Security (RLS)** - Database-level security
- ✅ **Free Tier** - 500MB database, 2GB bandwidth, perfect for development

---

## 🎯 Quick Start (5 minutes)

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click **"New Project"**
4. Fill in project details:
   ```
   Name: Africa Speaks Connect
   Database Password: [Create strong password - SAVE THIS!]
   Region: [Choose closest to your users]
   ```
5. Click **"Create new project"** and wait ~2 minutes

### Step 2: Get API Credentials

1. In your Supabase project, go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys" → "anon public")

### Step 3: Set Up Environment Variables

1. Copy the example file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 4: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 5: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL Editor
5. Click **"Run"** to execute

This creates all tables, indexes, and security policies!

---

## 📊 Database Schema

The schema includes:

### Core Tables
- **`events`** - Event listings
- **`speakers`** - Speaker profiles
- **`categories`** - Event categories
- **`event_speakers`** - Event-speaker relationships

### User Tables
- **`user_saved_events`** - User's saved events
- **`user_following_speakers`** - User's followed speakers
- **`event_registrations`** - Event registrations

### Admin Tables
- **`advertisements`** - Ad management
- **`speaker_applications`** - Pending speaker applications

### Features
- ✅ UUID primary keys
- ✅ Automatic timestamps (`created_at`, `updated_at`)
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for `updated_at` fields

---

## 🔐 Row Level Security (RLS)

RLS policies are configured to:
- **Public Access**: Events, speakers, categories (read-only)
- **Authenticated Users**: Can create/modify their own data
- **User Data**: Users can only access their own saved events, following, etc.

### Optional: Disable RLS for Development

If you want to test without authentication:
```sql
-- In Supabase SQL Editor
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE speakers DISABLE ROW LEVEL SECURITY;
-- ... (repeat for other tables)
```

**⚠️ Warning:** Only disable RLS in development!

---

## 🔄 How It Works

### Automatic Fallback Pattern

All services use this pattern:

```typescript
// Try Supabase first
const data = await supabaseService.events.list();

// If Supabase fails or not configured, falls back to mock data
// No breaking changes - app works either way!
```

### Integration Status

| Service | Supabase Integration | Mock Fallback |
|---------|---------------------|---------------|
| `supabaseService.events` | ✅ | ✅ |
| `supabaseService.speakers` | ✅ | ✅ |
| `supabaseService.users` | ✅ | ✅ |
| `supabaseService.admin` | ✅ | ✅ |

---

## 🛠️ Using Supabase in Your Code

### Example: Fetch Events

```typescript
import { supabaseService } from "@/services/supabaseService";

// This automatically uses Supabase if configured, or falls back to mock data
const events = await supabaseService.events.list({
  search: "tech",
  category: "Technology",
  isFree: true
});
```

### Example: Create Event

```typescript
const newEvent = await supabaseService.events.create({
  title: "My Event",
  date: "2024-03-15",
  time: "10:00 AM",
  location: "Online",
  category: "Technology",
  is_free: true,
  // ... other fields
});
```

### Example: User Operations

```typescript
// Save event
await supabaseService.users.saveEvent(userId, eventId);

// Follow speaker
await supabaseService.speakers.follow(userId, speakerId);

// Get following status
const isFollowing = await supabaseService.speakers.getFollowingStatus(userId, speakerId);
```

---

## 🔍 Real-time Subscriptions (Optional)

Supabase supports real-time updates! Example:

```typescript
import { supabase } from "@/lib/supabase";

// Subscribe to event changes
const subscription = supabase
  .channel("events")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "events" },
    (payload) => {
      console.log("Event changed:", payload);
      // Update your UI
    }
  )
  .subscribe();

// Unsubscribe when done
subscription.unsubscribe();
```

---

## 📁 Storage Setup (Optional)

Supabase Storage can handle file uploads:

1. In Supabase dashboard, go to **Storage**
2. Create buckets:
   - `events` - Event images
   - `speakers` - Speaker headshots
   - `speakers/media` - Speaker media files
   - `ads` - Advertisement images
   - `uploads` - General uploads

3. Set bucket policies:
   - Public read access for images
   - Authenticated write access

### Update Upload Service

You can update `src/services/uploadService.ts` to use Supabase Storage:

```typescript
import { supabase } from "@/lib/supabase";

async uploadImage(file: File, options?: UploadOptions) {
  const filePath = `${options?.folder || 'uploads'}/${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return { url: publicUrl };
}
```

---

## 🧪 Testing

### Test Connection

```typescript
import { checkSupabaseConnection } from "@/lib/supabase";

const isConnected = await checkSupabaseConnection();
console.log("Supabase connected:", isConnected);
```

### Check Console

When you run the app, look for:
- ✅ `"Supabase connected successfully"` - Working!
- ⚠️ `"Supabase not connected - using mock data fallback"` - Using fallback

---

## 🔧 Troubleshooting

### Issue: "Table does not exist"

**Solution:** Run the schema SQL file in Supabase SQL Editor

### Issue: "RLS policy violation"

**Solution:** 
1. Check RLS policies in Supabase dashboard
2. Ensure user is authenticated (if required)
3. Or temporarily disable RLS for development

### Issue: Connection timeout

**Solution:**
1. Check `VITE_SUPABASE_URL` is correct
2. Check `VITE_SUPABASE_ANON_KEY` is correct
3. Verify Supabase project is active

### Issue: CORS errors

**Solution:**
1. In Supabase dashboard → Settings → API
2. Add your frontend URL to "Allowed CORS origins"
3. Or use `*` for development (not recommended for production)

---

## 📈 Next Steps

### 1. Migrate Services (Gradual)

Start using Supabase in your services:

```typescript
// In eventService.ts
import { supabaseService } from "@/services/supabaseService";

async list(filters?: EventFilters) {
  return withFallback(
    async () => {
      // Try Supabase first
      const events = await supabaseService.events.list(filters);
      return events; // Transform to EventItem format
    },
    () => {
      // Fallback to existing mock
      return applyFilters(eventStore, filters);
    }
  );
}
```

### 2. Add Authentication (Optional)

Supabase Auth can replace your current auth:

```typescript
import { supabase } from "@/lib/supabase";

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### 3. Enable Real-time (Optional)

Add real-time subscriptions for live updates.

### 4. Set Up Storage (Optional)

Configure Supabase Storage for file uploads.

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Copied Project URL and anon key
- [ ] Added credentials to `.env`
- [ ] Installed dependencies (`npm install`)
- [ ] Ran schema SQL in Supabase SQL Editor
- [ ] Verified connection in browser console
- [ ] Tested fetching events
- [ ] Tested creating an event
- [ ] (Optional) Set up Storage buckets
- [ ] (Optional) Configured RLS policies

---

**🎉 You're all set! Your app now uses Supabase as the database backend!**

