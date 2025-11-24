# 🔌 Phase 3: Backend Integration Guide

**Status:** Ready for Integration  
**Pattern:** Supabase Database + API-first with automatic fallback to mock data  
**Implementation:** All services use `withFallback` pattern for seamless development

---

## 📋 Overview

The application supports **two backend integration options**:

### Option 1: Supabase Database (Recommended) ✅
- Direct database access via Supabase client
- Real-time subscriptions support
- Row Level Security (RLS)
- **Setup Guide:** See `SUPABASE_SETUP.md`

### Option 2: REST API Backend
- Traditional REST API endpoints
- Works with any backend framework
- Documented below

All frontend services:
- ✅ Try Supabase/API calls first
- ✅ Automatically fall back to mock data if unavailable
- ✅ Work seamlessly during development
- ✅ Ready for production when backend is deployed

---

## 🏗️ Architecture Pattern

### Current Pattern: `withFallback`

All services use this pattern:

```typescript
const withFallback = async <T>(request: () => Promise<T>, fallback: () => T) => {
  try {
    return await request(); // Try API first
  } catch (error) {
    console.warn("[service] falling back to mock data", error);
    return fallback(); // Use mock if API fails
  }
};
```

**Benefits:**
- ✅ Frontend works without backend
- ✅ Gradual backend integration possible
- ✅ Automatic fallback prevents crashes
- ✅ Easy debugging with console warnings

---

## 📡 Required Backend API Endpoints

### Base Configuration
```
Base URL: {VITE_API_BASE_URL}/api
Default: http://localhost:3000/api
Timeout: 30000ms (30 seconds)
```

---

### 1. Authentication Endpoints ✅

#### POST `/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  },
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

#### POST `/auth/register`
**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "acceptPrivacy": true
}
```

**Response:** Same as login

#### GET `/auth/me`
**Headers:** `Authorization: Bearer {accessToken}`

**Response:**
```json
{
  "id": "user-123",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "user"
}
```

#### POST `/auth/refresh`
**Request:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response:**
```json
{
  "accessToken": "new-jwt-access-token",
  "refreshToken": "new-jwt-refresh-token",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

#### POST `/auth/logout`
**Headers:** `Authorization: Bearer {accessToken}`

#### POST `/auth/forgot-password` ✅ NEW
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### POST `/auth/reset-password` ✅ NEW
**Request:**
```json
{
  "token": "reset-token-from-email",
  "password": "newPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### POST `/auth/verify-reset-token` ✅ NEW
**Request:**
```json
{
  "token": "reset-token"
}
```

**Response:**
```json
{
  "valid": true
}
```

---

### 2. File Upload Endpoints ✅ NEW

#### POST `/upload/image`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File (image file)
- `folder`: string (optional, e.g., "events", "speakers/headshots", "ads")

**Response:**
```json
{
  "url": "https://cdn.example.com/uploads/image.jpg",
  "id": "file-123",
  "size": 1024000
}
```

#### POST `/upload/file`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File (any file type)
- `folder`: string (optional)

**Response:**
```json
{
  "url": "https://cdn.example.com/uploads/document.pdf",
  "id": "file-456",
  "size": 2048000
}
```

#### DELETE `/upload/:fileId` ✅ NEW
**Headers:** `Authorization: Bearer {accessToken}`

**Response:**
```json
{
  "success": true
}
```

---

### 3. Event Endpoints ✅

#### GET `/events`
**Query Parameters:**
- `search`: string (optional)
- `category`: string (optional)
- `price`: "all" | "free" | "paid" (optional)

**Response:**
```json
[
  {
    "id": "evt-123",
    "title": "Event Title",
    "date": "2024-03-15",
    "time": "10:00 AM WAT",
    "location": "Online",
    "price": "Free",
    "isFree": true,
    "category": "Technology",
    "speakers": "Speaker Name",
    "attendees": 1250,
    "image": "https://...",
    "description": "..."
  }
]
```

#### GET `/events/:id`
**Response:** Single EventItem object

#### POST `/events`
**Headers:** `Authorization: Bearer {accessToken}`, `Content-Type: application/json`

**Request:**
```json
{
  "title": "Event Title",
  "date": "2024-03-15",
  "time": "10:00 AM WAT",
  "location": "Online",
  "category": "Technology",
  "description": "Event description",
  "price": 0,
  "image": "https://...",
  "speakerIds": ["spk-1", "spk-2"]
}
```

**Response:** EventItem object

#### PUT `/events/:id`
**Headers:** `Authorization: Bearer {accessToken}`

**Request:** Same as POST, plus `id` field

**Response:** Updated EventItem object

#### DELETE `/events/:id`
**Headers:** `Authorization: Bearer {accessToken}`

**Response:**
```json
{
  "success": true
}
```

#### POST `/events/:id/register` ✅ NEW
**Headers:** `Authorization: Bearer {accessToken}`

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+234 800 000 0000"
}
```

**Response:**
```json
{
  "success": true,
  "registrationId": "reg-123",
  "message": "Registration successful"
}
```

---

### 4. Speaker Endpoints ✅

#### GET `/speakers`
**Query Parameters:**
- `search`: string (optional)
- `industry`: string (optional)
- `verified`: boolean (optional)

**Response:**
```json
[
  {
    "id": "spk-123",
    "name": "Speaker Name",
    "title": "Title",
    "image": "https://...",
    "industry": "Technology",
    "verified": true,
    "events": 15,
    "followers": 2500
  }
]
```

#### GET `/speakers/:id`
**Response:** Single SpeakerProfile object

#### POST `/speakers/apply`
**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "speaker@example.com",
  "phone": "+234 800 000 0000",
  "location": "Lagos, Nigeria",
  "title": "Tech Innovation Leader",
  "industry": "Technology",
  "expertise": ["AI", "Digital Transformation"],
  "shortBio": "...",
  "longBio": "...",
  "headshot": "https://...",
  "topics": ["AI Ethics", "Digital Transformation"],
  "website": "https://...",
  "linkedin": "https://...",
  "twitter": "@johndoe",
  "facebook": "https://..."
}
```

**Response:**
```json
{
  "id": "spk-123",
  "message": "Application submitted successfully"
}
```

#### POST `/speakers/:id/follow` ✅ NEW
**Headers:** `Authorization: Bearer {accessToken}`

**Response:**
```json
{
  "success": true,
  "message": "Now following speaker"
}
```

#### POST `/speakers/:id/unfollow` ✅ NEW
**Headers:** `Authorization: Bearer {accessToken}`

**Response:**
```json
{
  "success": true,
  "message": "Unfollowed speaker"
}
```

#### GET `/speakers/:id/following-status` ✅ NEW
**Headers:** `Authorization: Bearer {accessToken}`

**Response:**
```json
{
  "following": true
}
```

#### GET `/speakers/:id/events` ✅ NEW
**Response:**
```json
[
  {
    "id": "evt-123",
    "title": "Event Title",
    "date": "2024-03-15",
    "time": "10:00 AM WAT",
    "location": "Online",
    "image": "https://..."
  }
]
```

#### GET `/speakers/dashboard` ✅ NEW
**Headers:** `Authorization: Bearer {accessToken}`

**Response:**
```json
{
  "stats": {
    "totalEvents": 15,
    "followers": 2500,
    "profileViews": 12500,
    "rating": 4.9
  },
  "upcomingEvents": [...],
  "invitations": [...]
}
```

---

### 5. User Endpoints ✅

#### GET `/users/dashboard`
**Headers:** `Authorization: Bearer {accessToken}`

**Response:**
```json
{
  "stats": {
    "registeredEvents": 3,
    "savedEvents": 5,
    "followingSpeakers": 8,
    "pastEvents": 12
  },
  "upcomingEvents": [...],
  "savedEvents": [...],
  "notifications": [...]
}
```

#### POST `/users/saved-events`
**Headers:** `Authorization: Bearer {accessToken}`

**Request:**
```json
{
  "id": "evt-123",
  "title": "Event Title",
  "date": "2024-03-15",
  "image": "https://..."
}
```

**Response:**
```json
{
  "success": true
}
```

#### DELETE `/users/saved-events/:id`
**Headers:** `Authorization: Bearer {accessToken}`

**Response:**
```json
{
  "success": true
}
```

---

### 6. Admin Endpoints ✅

#### GET `/admin/dashboard`
**Headers:** `Authorization: Bearer {accessToken}` (Admin role required)

**Response:**
```json
{
  "stats": {
    "totalEvents": 42,
    "registrationsToday": 1234,
    "revenueThisMonth": 12500,
    "growthThisWeek": 24
  },
  "events": [...],
  "categories": [...],
  "speakers": [...],
  "ads": [...]
}
```

#### POST `/admin/events`
**Headers:** `Authorization: Bearer {accessToken}` (Admin role required)

**Request:** Same as POST `/events`

#### PUT `/admin/categories/:id`
**Headers:** `Authorization: Bearer {accessToken}` (Admin role required)

**Request:**
```json
{
  "name": "Technology",
  "description": "Tech events",
  "color": "#6366f1"
}
```

#### POST `/admin/ads` ✅ NEW
**Headers:** `Authorization: Bearer {accessToken}` (Admin role required)

**Request:**
```json
{
  "id": "ad-123",
  "title": "Banner Ad",
  "image": "https://...",
  "link": "https://...",
  "description": "...",
  "activeUntil": "2024-12-31"
}
```

**Response:**
```json
{
  "id": "ad-123",
  "title": "Banner Ad",
  "impressions": 0,
  "clicks": 0,
  "activeUntil": "2024-12-31",
  "image": "https://...",
  "link": "https://..."
}
```

#### PUT `/admin/ads/:id` ✅ NEW
**Headers:** `Authorization: Bearer {accessToken}` (Admin role required)

**Request:** Partial AdminAd object

**Response:** Updated AdminAd object

#### DELETE `/admin/ads/:id` ✅ NEW
**Headers:** `Authorization: Bearer {accessToken}` (Admin role required)

**Response:**
```json
{
  "success": true
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login/Register** → Get `accessToken` and `refreshToken`
2. **Store Tokens** → Saved to localStorage/cookies via `tokenManager`
3. **Auto-Attach** → `authInterceptors` adds `Authorization: Bearer {token}` to all requests
4. **Auto-Refresh** → If token expires, automatically refresh using `refreshToken`
5. **Logout** → Clear tokens and invalidate session

### Authorization Roles

- **User**: Default role, can browse and register
- **Speaker**: Can access speaker dashboard, manage profile
- **Admin**: Can access admin dashboard, manage all resources

### Protected Routes

- `/dashboard` - User dashboard (ProtectedRoute)
- `/admin/*` - Admin routes (AdminRoute)
- `/speaker-dashboard` - Speaker dashboard (SpeakerRoute)

---

## 🛠️ Implementation Steps

### Step 1: Set Up Backend Server

```bash
# Example Node.js/Express backend structure
backend/
├── routes/
│   ├── auth.js
│   ├── events.js
│   ├── speakers.js
│   ├── users.js
│   ├── admin.js
│   └── upload.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
└── server.js
```

### Step 2: Configure Environment

```bash
# Frontend .env
VITE_API_BASE_URL=http://localhost:3000

# Backend .env
PORT=3000
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://...
```

### Step 3: Test API Endpoints

Use the endpoints listed above. Frontend will automatically:
- ✅ Try API first
- ✅ Fall back to mock data if API unavailable
- ✅ Show console warnings when falling back

### Step 4: Verify Integration

1. **Test with backend OFF** → Should use mock data
2. **Start backend** → Should use real API
3. **Stop backend** → Should gracefully fall back to mock

---

## 📊 Testing Backend Integration

### Manual Testing

```typescript
// In browser console
// Test if API is available
fetch('http://localhost:3000/api/events')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Check Fallback Behavior

1. Open browser console
2. Look for warnings: `[service] falling back to mock data`
3. These indicate API unavailable, using fallback

---

## 🔄 Service Integration Status

| Service | API Ready | Mock Fallback | Status |
|---------|-----------|---------------|--------|
| `authService` | ✅ | ✅ | Ready |
| `eventService` | ✅ | ✅ | Ready |
| `speakerService` | ✅ | ✅ | Ready |
| `userService` | ✅ | ✅ | Ready |
| `adminService` | ✅ | ✅ | Ready |
| `uploadService` | ✅ | ❌ | Needs fallback |
| `passwordResetService` | ✅ | ❌ | Needs fallback |

---

## 🚀 Next Steps

1. **Start Backend Development**
   - Implement endpoints from this document
   - Match request/response formats exactly
   - Add proper authentication/authorization

2. **Update Services (if needed)**
   - Add fallback to `uploadService`
   - Add fallback to `passwordResetService`
   - Test with backend unavailable

3. **Test Integration**
   - Verify all endpoints work
   - Test authentication flow
   - Test error handling

4. **Deploy**
   - Update `VITE_API_BASE_URL` for production
   - Ensure backend CORS is configured
   - Test in production environment

---

## 📝 Notes

- All services handle errors gracefully
- Console warnings indicate fallback usage
- No breaking changes needed - just start backend!
- Frontend works completely without backend
- Gradual integration possible - enable endpoints one by one

