# 🔐 Supabase Auth Setup (Quick Fix)

**Problem:** Registration fails because frontend tries to call `http://localhost:3000/api/auth/register` but there's no backend running.

**Solution:** Use Supabase Auth directly - no backend needed!

---

## ✅ Step 1: Add Supabase Credentials

Edit `.env` (create if it doesn't exist):

```bash
# Copy example file
cp env.example .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get credentials from:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## ✅ Step 2: Run Database Schema

1. Go to Supabase Dashboard → **SQL Editor**
2. Create new query
3. Copy/paste contents of `supabase/schema.sql`
4. Click **Run**

This creates:
- `users` table
- `events` table
- `speakers` table
- `categories` table
- `ads` table
- All relationships and indexes

---

## ✅ Step 3: Update Auth Service (Quick Fix)

The current `authService.ts` uses REST API. Update it to use Supabase Auth:

### Option A: Quick Fix (Update authService.ts)

Replace `src/services/authService.ts` with Supabase Auth version:

**See:** The updated file will be created in next step.

### Option B: Hybrid (Keep both)

Keep REST API fallback, add Supabase Auth option.

---

## 🚀 Quick Implementation

The fastest way to get registration working:

1. **Add Supabase credentials to `.env`** (Step 1 above)
2. **Run schema** in Supabase SQL Editor (Step 2 above)
3. **Update `authService.ts`** to use Supabase Auth

**Restart dev server:**
```bash
npm run dev
```

---

## 🔄 What Changes

### Before (REST API):
```typescript
// authService.ts
async register(payload) {
  const response = await apiClient.post('/auth/register', payload);
  // ...
}
```

### After (Supabase Auth):
```typescript
// authService.ts
import { supabase } from '@/lib/supabase';

async register(payload) {
  // Use Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        name: payload.name,
      }
    }
  });
  // ...
}
```

---

## ✅ Testing

After updating:

1. **Restart dev server**
2. **Try registration:**
   - Go to `/auth`
   - Click "Sign Up" tab
   - Fill in form
   - Submit

**Expected:**
- ✅ Success message
- ✅ User created in Supabase
- ✅ Auto-login (or email confirmation if enabled)

---

## 🔍 Troubleshooting

### Error: "Email already registered"
- User exists in Supabase
- Try login instead

### Error: "Invalid API key"
- Check `.env` has correct `VITE_SUPABASE_ANON_KEY`
- Restart dev server after editing `.env`

### Error: "Failed to fetch"
- Check `VITE_SUPABASE_URL` is correct
- Ensure Supabase project is active
- Check browser console for CORS errors

### Registration succeeds but no user in database
- Supabase Auth creates user in `auth.users` table
- Need to create corresponding row in `users` table
- Use database trigger or Supabase function (see schema.sql)

---

## 📋 Next Steps

After auth is working:

1. ✅ Update other services to use Supabase
2. ✅ Implement file uploads via Supabase Storage
3. ✅ Add real-time subscriptions if needed

---

## 🎯 Ready to Update?

I can update `authService.ts` to use Supabase Auth right now - just confirm!

This will:
- ✅ Fix registration/login immediately
- ✅ No backend server needed
- ✅ Keep existing code structure
- ✅ Add Supabase Auth integration

Would you like me to update the auth service now?

