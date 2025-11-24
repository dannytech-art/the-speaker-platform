# 🔧 Troubleshooting Guide

## "We couldn't reach the server" Error

This error appears when authentication fails. Here's how to fix it:

---

### ✅ Step 1: Verify Supabase Configuration

Check that `.env` has correct Supabase credentials:

```bash
# In project root
cat .env | grep SUPABASE
```

**Expected output:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**If missing or wrong:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Settings** → **API**
3. Copy **Project URL** → `VITE_SUPABASE_URL`
4. Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`
5. Add to `.env` file
6. **Restart dev server**: `npm run dev`

---

### ✅ Step 2: Check Browser Console

Open browser DevTools (F12) → **Console** tab

Look for errors:
- `[Supabase] URL or Anon Key not configured` → Supabase not configured
- `[authService] Supabase operation failed` → Check error details
- `Failed to fetch` → Network/CORS issue

---

### ✅ Step 3: Common Issues & Fixes

#### Issue 1: Supabase Not Configured

**Error:** "Authentication service is not available..."

**Fix:**
1. Create/update `.env` file with Supabase credentials
2. Restart dev server

#### Issue 2: Email Confirmation Required

**Error:** "Email not confirmed" or registration succeeds but can't login

**Fix:**
1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Find **Email Auth** section
3. **Disable "Confirm email"** (for development)
4. OR check your email for confirmation link

#### Issue 3: User Already Exists

**Error:** "User already registered"

**Fix:**
- User exists in Supabase Auth
- Try **Sign In** instead of **Sign Up**
- OR delete user in Supabase Dashboard → **Authentication** → **Users**

#### Issue 4: Network/CORS Error

**Error:** "Failed to fetch" or "NetworkError"

**Fix:**
1. Check internet connection
2. Verify Supabase URL is correct
3. Check browser console for CORS errors
4. Ensure Supabase project is active (not paused)

#### Issue 5: Invalid Credentials

**Error:** "Invalid login credentials"

**Fix:**
- Check email/password spelling
- Use **Forgot Password** to reset
- OR create new account with different email

---

### ✅ Step 4: Test Supabase Connection

Run this in browser console (F12 → Console):

```javascript
// Test Supabase connection
fetch('YOUR_SUPABASE_URL/rest/v1/categories?select=id&limit=1', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Replace:**
- `YOUR_SUPABASE_URL` → From `.env` file
- `YOUR_ANON_KEY` → From `.env` file

**Expected:** Returns JSON array (even if empty)

**If error:** Supabase connection issue

---

### ✅ Step 5: Check Supabase Auth Settings

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Check:
   - ✅ **Email Auth** enabled
   - ✅ **Confirm email** disabled (for testing)
   - ✅ **Site URL** matches your app URL (e.g., `http://localhost:5173`)

---

### ✅ Step 6: Restart Dev Server

After changing `.env`:

```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

**Important:** Vite requires restart to load new env variables!

---

## 🔍 Debugging Steps

1. **Check `.env` file exists and has Supabase vars**
2. **Restart dev server** after env changes
3. **Open browser console** (F12) - look for errors
4. **Check Supabase Dashboard** - is project active?
5. **Test Supabase connection** (see Step 4 above)
6. **Verify email/password** - try reset password
7. **Check Auth settings** - email confirmation disabled?

---

## 📝 Quick Checklist

- [ ] `.env` file exists in project root
- [ ] `VITE_SUPABASE_URL` is set (not empty)
- [ ] `VITE_SUPABASE_ANON_KEY` is set (not empty)
- [ ] Dev server restarted after env changes
- [ ] Browser console shows no CORS errors
- [ ] Supabase project is active (not paused)
- [ ] Email confirmation disabled (for testing)
- [ ] Site URL matches in Supabase Auth settings

---

## 🆘 Still Not Working?

1. **Clear browser cache:**
   ```javascript
   // In browser console:
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Check Supabase project status:**
   - Go to Supabase Dashboard
   - Verify project is not paused
   - Check project health status

3. **Try in incognito/private window:**
   - Rules out browser cache issues

4. **Check network tab:**
   - F12 → Network tab
   - Try login/register
   - Look for failed requests
   - Check request URL and headers

---

## 📞 Need More Help?

Check:
- Browser console for specific errors
- Network tab for failed requests
- Supabase Dashboard → Logs for server errors

