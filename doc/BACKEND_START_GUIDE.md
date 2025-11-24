# 🚀 Backend Startup Guide

**Current Status:** Frontend-only application (no backend server)

The registration/login is trying to call `VITE_API_BASE_URL` (default: `http://localhost:3000/api`) but there's no server running.

---

## ✅ **Option 1: Use Supabase Directly (Recommended - No Backend Needed!)**

Since you're using Supabase, you can use **Supabase Auth** directly - no separate backend server needed!

### Quick Setup (5 minutes)

1. **Add Supabase credentials to `.env`:**

```bash
# Copy example file if you don't have .env yet
cp env.example .env
```

Edit `.env` and add:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **Run the Supabase schema:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project → **SQL Editor**
   - Copy/paste contents of `supabase/schema.sql`
   - Click **Run**

3. **Update Auth Service to use Supabase:**

The auth service needs to be updated to use Supabase Auth instead of REST API. This is a one-time change.

**See:** `SUPABASE_AUTH_SETUP.md` (I'll create this next)

---

## 🔧 **Option 2: Create Node.js/Express Backend**

If you prefer a traditional REST API backend:

### Quick Start (10 minutes)

```bash
# Create backend folder
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors dotenv jsonwebtoken bcryptjs
npm install -D typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs ts-node nodemon

# Create basic server
mkdir src
touch src/index.ts
```

**Create `backend/src/index.ts`:**
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Auth routes (placeholder)
app.post('/api/auth/register', async (req, res) => {
  // TODO: Implement registration
  res.status(501).json({ error: 'Not implemented yet' });
});

app.post('/api/auth/login', async (req, res) => {
  // TODO: Implement login
  res.status(501).json({ error: 'Not implemented yet' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
```

**Create `backend/.env`:**
```env
PORT=3000
NODE_ENV=development
```

**Create `backend/package.json` scripts:**
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

**Start backend:**
```bash
cd backend
npm run dev
```

**Update frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🎯 **Recommended: Hybrid Approach**

**Use Supabase for:**
- ✅ Authentication (Supabase Auth)
- ✅ Database (PostgreSQL via Supabase)
- ✅ File Storage (Supabase Storage)

**Create minimal backend for:**
- Payment processing (Stripe/Paystack webhooks)
- Custom business logic
- Third-party integrations

---

## 🔍 **Check Current Setup**

Run this to see what's configured:

```bash
# Check if .env exists
ls -la .env

# Check current API base URL (if .env exists)
grep VITE_API_BASE_URL .env || echo "VITE_API_BASE_URL not set"
```

---

## 📋 **Next Steps**

1. **If using Supabase (Option 1):**
   - ✅ Set up `.env` with Supabase credentials
   - ✅ Run `supabase/schema.sql` in Supabase Dashboard
   - ⏭️ Update `authService.ts` to use Supabase Auth (see guide below)

2. **If creating backend (Option 2):**
   - ✅ Follow steps above to create backend server
   - ⏭️ Implement auth endpoints matching `BACKEND_INTEGRATION.md`
   - ⏭️ Connect to Supabase or PostgreSQL database

---

## ⚠️ **Current Error Explained**

**Error:** "We couldn't reach the server. Please check your connection and try again."

**Cause:** Frontend is trying to POST to:
```
http://localhost:3000/api/auth/register
```

But there's no server running on port 3000.

**Solution:** 
- Use Supabase Auth (Option 1) - **no server needed**
- OR start backend server (Option 2)

---

## 🚀 **Quick Fix (Use Supabase Auth)**

The fastest way to get registration working:

1. Add Supabase credentials to `.env`
2. Update `src/services/authService.ts` to use Supabase Auth
3. Restart frontend dev server

Would you like me to update the auth service to use Supabase Auth directly? It's a quick change!

