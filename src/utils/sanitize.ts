import type { CreateEventPayload, UpdateEventPayload } from "@/types/event";

interface SanitizedEventPayload extends Partial<CreateEventPayload> {
  id?: string;
  speakerIds?: string[];
  capacity?: number;
  tags?: string[];
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  registrationDeadline?: string;
  isOnline?: boolean;
  onlineLink?: string;
}

/**
 * Sanitizes event payload to ensure data integrity and remove unwanted fields
 */
export function sanitizeEventPayload(
  payload: SanitizedEventPayload & { [key: string]: unknown }
): CreateEventPayload & {
  id?: string;
  speakerIds?: string[];
  capacity?: number;
  tags?: string[];
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  registrationDeadline?: string;
  isOnline?: boolean;
  onlineLink?: string;
} {
  const sanitized: SanitizedEventPayload = {};

  // Required fields
  if (payload.title && typeof payload.title === "string") {
    sanitized.title = payload.title.trim();
  }

  if (payload.date && typeof payload.date === "string") {
    sanitized.date = payload.date.trim();
  }

  if (payload.time && typeof payload.time === "string") {
    sanitized.time = payload.time.trim();
  }

  if (payload.location && typeof payload.location === "string") {
    sanitized.location = payload.location.trim();
  }

  if (payload.category && typeof payload.category === "string") {
    sanitized.category = payload.category.trim();
  }

  if (payload.description && typeof payload.description === "string") {
    sanitized.description = payload.description.trim();
  }

  // Price handling
  if (payload.price !== undefined) {
    if (typeof payload.price === "number") {
      sanitized.price = Math.max(0, payload.price);
    } else if (typeof payload.price === "string") {
      const parsed = parseFloat(payload.price);
      sanitized.price = isNaN(parsed) ? 0 : Math.max(0, parsed);
    } else {
      sanitized.price = 0;
    }
  }

  // Optional fields
  if (payload.id && typeof payload.id === "string") {
    sanitized.id = payload.id.trim();
  }

  if (payload.image && typeof payload.image === "string") {
    sanitized.image = payload.image.trim();
  }

  if (Array.isArray(payload.speakerIds)) {
    sanitized.speakerIds = payload.speakerIds.filter(
      (id): id is string => typeof id === "string"
    );
  }

  if (payload.capacity !== undefined) {
    if (typeof payload.capacity === "number") {
      sanitized.capacity = Math.max(1, Math.floor(payload.capacity));
    } else if (typeof payload.capacity === "string") {
      const parsed = parseInt(payload.capacity, 10);
      sanitized.capacity = isNaN(parsed) ? undefined : Math.max(1, parsed);
    }
  }

  if (Array.isArray(payload.tags)) {
    sanitized.tags = payload.tags
      .filter((tag): tag is string => typeof tag === "string")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  if (payload.organizer && typeof payload.organizer === "string") {
    sanitized.organizer = payload.organizer.trim();
  }

  if (payload.contactEmail && typeof payload.contactEmail === "string") {
    const email = payload.contactEmail.trim();
    // Basic email validation
    if (email.includes("@") && email.includes(".")) {
      sanitized.contactEmail = email;
    }
  }

  if (payload.contactPhone && typeof payload.contactPhone === "string") {
    sanitized.contactPhone = payload.contactPhone.trim();
  }

  if (payload.website && typeof payload.website === "string") {
    let website = payload.website.trim();
    // Ensure URL has protocol
    if (website && !website.match(/^https?:\/\//i)) {
      website = `https://${website}`;
    }
    sanitized.website = website;
  }

  if (payload.registrationDeadline && typeof payload.registrationDeadline === "string") {
    sanitized.registrationDeadline = payload.registrationDeadline.trim();
  }

  if (typeof payload.isOnline === "boolean") {
    sanitized.isOnline = payload.isOnline;
  }

  if (payload.onlineLink && typeof payload.onlineLink === "string") {
    let link = payload.onlineLink.trim();
    // Ensure URL has protocol
    if (link && !link.match(/^https?:\/\//i)) {
      link = `https://${link}`;
    }
    sanitized.onlineLink = link;
  }

  return sanitized as CreateEventPayload & {
    id?: string;
    speakerIds?: string[];
    capacity?: number;
    tags?: string[];
    organizer?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    registrationDeadline?: string;
    isOnline?: boolean;
    onlineLink?: string;
  };
}

/**
 * Sanitizes speaker application payload to ensure data integrity
 */
export function sanitizeSpeakerPayload(payload: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  title?: string;
  industry?: string;
  expertise?: string;
  shortBio?: string;
  longBio?: string;
  headshot?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  experience?: string;
  sampleVideo?: string;
  topics?: string;
  [key: string]: unknown;
}): {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  industry: string;
  expertise: string;
  shortBio: string;
  longBio: string;
  headshot: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  experience?: string;
  sampleVideo?: string;
  topics: string;
} {
  const sanitized: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    industry: string;
    expertise: string;
    shortBio: string;
    longBio: string;
    headshot: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    experience?: string;
    sampleVideo?: string;
    topics: string;
  } = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    industry: "",
    expertise: "",
    shortBio: "",
    longBio: "",
    headshot: "",
    topics: "",
  };

  // Required string fields
  if (payload.firstName && typeof payload.firstName === "string") {
    sanitized.firstName = payload.firstName.trim();
  }

  if (payload.lastName && typeof payload.lastName === "string") {
    sanitized.lastName = payload.lastName.trim();
  }

  if (payload.email && typeof payload.email === "string") {
    sanitized.email = payload.email.trim().toLowerCase();
  }

  if (payload.phone && typeof payload.phone === "string") {
    sanitized.phone = payload.phone.trim();
  }

  if (payload.location && typeof payload.location === "string") {
    sanitized.location = payload.location.trim();
  }

  if (payload.title && typeof payload.title === "string") {
    sanitized.title = payload.title.trim();
  }

  if (payload.industry && typeof payload.industry === "string") {
    sanitized.industry = payload.industry.trim();
  }

  if (payload.expertise && typeof payload.expertise === "string") {
    sanitized.expertise = payload.expertise.trim();
  }

  if (payload.shortBio && typeof payload.shortBio === "string") {
    sanitized.shortBio = payload.shortBio.trim();
  }

  if (payload.longBio && typeof payload.longBio === "string") {
    sanitized.longBio = payload.longBio.trim();
  }

  if (payload.headshot && typeof payload.headshot === "string") {
    sanitized.headshot = payload.headshot.trim();
  }

  if (payload.topics && typeof payload.topics === "string") {
    sanitized.topics = payload.topics.trim();
  }

  // Optional fields
  if (payload.website && typeof payload.website === "string") {
    let website = payload.website.trim();
    if (website && !website.match(/^https?:\/\//i)) {
      website = `https://${website}`;
    }
    sanitized.website = website;
  }

  if (payload.linkedin && typeof payload.linkedin === "string") {
    let linkedin = payload.linkedin.trim();
    if (linkedin && !linkedin.match(/^https?:\/\//i)) {
      linkedin = `https://${linkedin}`;
    }
    sanitized.linkedin = linkedin;
  }

  if (payload.twitter && typeof payload.twitter === "string") {
    sanitized.twitter = payload.twitter.trim().replace(/^@/, "");
  }

  if (payload.facebook && typeof payload.facebook === "string") {
    let facebook = payload.facebook.trim();
    if (facebook && !facebook.match(/^https?:\/\//i)) {
      facebook = `https://${facebook}`;
    }
    sanitized.facebook = facebook;
  }

  if (payload.experience && typeof payload.experience === "string") {
    sanitized.experience = payload.experience.trim();
  }

  if (payload.sampleVideo && typeof payload.sampleVideo === "string") {
    sanitized.sampleVideo = payload.sampleVideo.trim();
  }

  return sanitized;
}

