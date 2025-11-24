# 🧪 Supabase API Testing Commands

Quick curl commands to test your Supabase connection and API key.

---

## 📋 Prerequisites

Replace these placeholders with your actual values:
- `YOUR_SUPABASE_URL` - e.g., `https://xxxxx.supabase.co`
- `YOUR_ANON_KEY` - Your anon public key from Supabase Settings → API

---

## 🔍 Basic Connection Test

### Test 1: Simple Query (Categories Table)

```bash
curl -X GET \
  'YOUR_SUPABASE_URL/rest/v1/categories?select=*' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Technology",
    "description": "Tech and innovation events",
    "color": "#6366f1",
    "created_at": "2024-01-01T00:00:00Z"
  },
  ...
]
```

### Test 2: Events Query (Limit 5)

```bash
curl -X GET \
  'YOUR_SUPABASE_URL/rest/v1/events?select=*&limit=5' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

### Test 3: Check if Supabase is Accessible

```bash
curl -I \
  'YOUR_SUPABASE_URL/rest/v1/' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Expected:** `200 OK` or `401 Unauthorized` (if table doesn't exist yet)

---

## 📝 Example with Real Values

Replace with your actual credentials:

```bash
# Example: Get all categories
curl -X GET \
  'https://abcdefghijklmnop.supabase.co/rest/v1/categories?select=*' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDAwMDAwMCwiZXhwIjoxOTU1NTYzMjAwfQ.example" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDAwMDAwMCwiZXhwIjoxOTU1NTYzMjAwfQ.example" \
  -H "Content-Type: application/json"
```

---

## 🔐 Authentication Tests

### Test 4: Get Current User (Requires Auth)

```bash
curl -X GET \
  'YOUR_SUPABASE_URL/auth/v1/user' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test 5: Sign Up Test User

```bash
curl -X POST \
  'YOUR_SUPABASE_URL/auth/v1/signup' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### Test 6: Sign In Test User

```bash
curl -X POST \
  'YOUR_SUPABASE_URL/auth/v1/token?grant_type=password' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

---

## 📊 Data Operations Tests

### Test 7: Insert Event (Requires Auth)

```bash
curl -X POST \
  'YOUR_SUPABASE_URL/rest/v1/events' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "title": "Test Event",
    "date": "2024-12-31",
    "time": "10:00 AM",
    "location": "Online",
    "category": "Technology",
    "is_free": true,
    "description": "Test event description"
  }'
```

### Test 8: Update Event

```bash
curl -X PATCH \
  'YOUR_SUPABASE_URL/rest/v1/events?id=eq.EVENT_ID' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "title": "Updated Event Title"
  }'
```

### Test 9: Delete Event

```bash
curl -X DELETE \
  'YOUR_SUPABASE_URL/rest/v1/events?id=eq.EVENT_ID' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Prefer: return=representation"
```

---

## 🔍 Query Filters

### Test 10: Filter Events by Category

```bash
curl -X GET \
  'YOUR_SUPABASE_URL/rest/v1/events?select=*&category=eq.Technology' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

### Test 11: Search Events (Text Search)

```bash
curl -X GET \
  'YOUR_SUPABASE_URL/rest/v1/events?select=*&title=ilike.*tech*' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

### Test 12: Get Free Events Only

```bash
curl -X GET \
  'YOUR_SUPABASE_URL/rest/v1/events?select=*&is_free=eq.true' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

---

## 🎯 Quick Test Script

Save this as `test-supabase.sh`:

```bash
#!/bin/bash

# Set your Supabase credentials
SUPABASE_URL="YOUR_SUPABASE_URL"
ANON_KEY="YOUR_ANON_KEY"

echo "🧪 Testing Supabase Connection..."
echo ""

# Test 1: Connection
echo "1. Testing connection..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  "$SUPABASE_URL/rest/v1/categories?select=id&limit=1" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY")

if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ Connection successful! (HTTP $HTTP_CODE)"
elif [ "$HTTP_CODE" = "401" ]; then
  echo "   ⚠️  Connected but unauthorized - check your API key"
elif [ "$HTTP_CODE" = "404" ]; then
  echo "   ⚠️  Table might not exist yet - run schema.sql first"
else
  echo "   ❌ Connection failed (HTTP $HTTP_CODE)"
fi

# Test 2: Get categories
echo ""
echo "2. Fetching categories..."
CATEGORIES=$(curl -s \
  "$SUPABASE_URL/rest/v1/categories?select=*" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json")

if [ -n "$CATEGORIES" ] && [ "$CATEGORIES" != "[]" ]; then
  echo "   ✅ Categories retrieved:"
  echo "$CATEGORIES" | head -5
else
  echo "   ⚠️  No categories found (might be empty or schema not run)"
fi

# Test 3: Get events
echo ""
echo "3. Fetching events..."
EVENTS=$(curl -s \
  "$SUPABASE_URL/rest/v1/events?select=*&limit=3" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json")

if [ -n "$EVENTS" ] && [ "$EVENTS" != "[]" ]; then
  echo "   ✅ Events retrieved:"
  echo "$EVENTS" | head -5
else
  echo "   ⚠️  No events found (table might be empty)"
fi

echo ""
echo "✅ Tests complete!"
```

**Usage:**
```bash
chmod +x test-supabase.sh
./test-supabase.sh
```

---

## 🔑 Where to Find Your Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → `YOUR_SUPABASE_URL`
   - **anon public** key → `YOUR_ANON_KEY`

---

## 📝 Common Response Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Invalid or missing API key
- **404 Not Found** - Table/resource doesn't exist
- **406 Not Acceptable** - RLS policy violation

---

## 🐛 Troubleshooting

### Error: "relation does not exist"
**Solution:** Run `supabase/schema.sql` in Supabase SQL Editor

### Error: "new row violates row-level security policy"
**Solution:** 
1. Disable RLS for development: `ALTER TABLE events DISABLE ROW LEVEL SECURITY;`
2. Or ensure you're authenticated with valid user token

### Error: "invalid API key"
**Solution:** Check that your `ANON_KEY` is correct from Settings → API

### Error: "permission denied"
**Solution:** Check RLS policies - might need to authenticate or adjust policies

---

## 📚 Supabase REST API Docs

- [PostgREST Documentation](https://postgrest.org/en/stable/api.html)
- [Supabase API Reference](https://supabase.com/docs/reference/javascript/select)

