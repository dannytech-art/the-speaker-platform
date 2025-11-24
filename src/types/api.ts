/**
 * API Request/Response Types
 * 
 * This file contains TypeScript interfaces for all API endpoints
 * to ensure type safety and proper integration with the backend.
 */

// ============================================================================
// Authentication API
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  acceptPrivacy: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "speaker" | "admin";
    avatar?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

// ============================================================================
// Password Reset API
// ============================================================================

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  email?: string;
}

// ============================================================================
// File Upload API
// ============================================================================

export interface UploadImageRequest {
  file: File;
  folder?: string;
}

export interface UploadImageResponse {
  url: string;
  id?: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface UploadFileRequest {
  file: File;
  folder?: string;
}

export interface UploadFileResponse {
  url: string;
  id?: string;
  size?: number;
  mimeType?: string;
}

export interface DeleteFileRequest {
  fileId: string;
}

// ============================================================================
// Events API
// ============================================================================

export interface CreateEventRequest {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  capacity?: number;
  tags?: string[];
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  registrationDeadline?: string;
  isOnline?: boolean;
  onlineLink?: string;
  speakerIds?: string[];
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

export interface EventResponse {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  capacity?: number;
  tags?: string[];
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  registrationDeadline?: string;
  isOnline?: boolean;
  onlineLink?: string;
  speakers?: Array<{
    id: string;
    name: string;
    image?: string;
  }>;
  attendees?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterEventRequest {
  eventId: string;
  name: string;
  email: string;
  phone?: string;
}

export interface RegisterEventResponse {
  success: boolean;
  registrationId: string;
  message?: string;
}

export interface SaveEventRequest {
  eventId: string;
}

export interface UnsaveEventRequest {
  eventId: string;
}

// ============================================================================
// Speakers API
// ============================================================================

export interface SpeakerListRequest {
  search?: string;
  industry?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
}

export interface SpeakerListResponse {
  speakers: Array<{
    id: string;
    name: string;
    title: string;
    image: string;
    industry: string;
    verified: boolean;
    events: number;
    followers: number;
    location?: string;
    rating?: number;
    shortBio?: string;
  }>;
  total: number;
  page: number;
  limit: number;
}

export interface SpeakerDetailResponse {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  title: string;
  image: string;
  industry: string;
  verified: boolean;
  events: number;
  followers: number;
  location?: string;
  email?: string;
  phone?: string;
  rating?: number;
  shortBio?: string;
  longBio?: string;
  expertise?: string[];
  speakingTopics?: string[];
  previousExperience?: string;
  sampleVideoUrl?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FollowSpeakerRequest {
  speakerId: string;
}

export interface FollowSpeakerResponse {
  success: boolean;
  following: boolean;
}

export interface FollowingStatusResponse {
  following: boolean;
}

export interface SpeakerEventsResponse {
  events: Array<{
    id: string;
    title: string;
    image: string;
    date: string;
    time: string;
    location: string;
    price: string;
    isFree: boolean;
    category: string;
    attendees?: number;
  }>;
}

export interface SpeakerApplicationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  industry: string;
  expertise: string[];
  shortBio: string;
  longBio: string;
  headshot: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  experience?: string;
  sampleVideo?: string;
  topics: string[];
}

export interface SpeakerApplicationResponse {
  id: string;
  status: "pending" | "approved" | "rejected";
  message?: string;
}

// ============================================================================
// Admin API
// ============================================================================

export interface AdminDashboardResponse {
  stats: {
    totalEvents: number;
    registrationsToday: number;
    revenueThisMonth: number;
    growthThisWeek: number;
  };
  events: EventResponse[];
  categories: Array<{
    id: number;
    name: string;
    description: string;
    color: string;
  }>;
  speakers: SpeakerDetailResponse[]; // Pending applications
  ads: Array<{
    id: string;
    title: string;
    impressions: number;
    clicks: number;
    activeUntil: string;
    image?: string;
    link?: string;
    description?: string;
  }>;
}

export interface CreateAdRequest {
  title: string;
  image?: string;
  link?: string;
  description?: string;
  activeUntil: string;
}

export interface UpdateAdRequest extends Partial<CreateAdRequest> {
  id: string;
}

export interface DeleteAdRequest {
  adId: string;
}

export interface ApproveSpeakerRequest {
  speakerId: string;
}

export interface RejectSpeakerRequest {
  speakerId: string;
  reason?: string;
}

// ============================================================================
// User Dashboard API
// ============================================================================

export interface UserDashboardResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  savedEvents: Array<{
    id: string;
    title: string;
    date: string;
    image: string;
  }>;
  registeredEvents: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
  }>;
  followingSpeakers: Array<{
    id: string;
    name: string;
    image: string;
  }>;
}

// ============================================================================
// Common API Types
// ============================================================================

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  code?: string;
  statusCode: number;
}

export interface SuccessResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

