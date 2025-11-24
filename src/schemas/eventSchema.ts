import { z } from "zod";
import { futureDateSchema, timeSchema, priceSchema, urlSchema } from "@/utils/validation";

/**
 * Event validation schemas
 */

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(50, "Description must be at least 50 characters").max(5000, "Description must be less than 5000 characters"),
  date: futureDateSchema,
  time: timeSchema,
  location: z.string().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
  category: z.string().min(1, "Category is required"),
  price: priceSchema.default(0),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  capacity: z.number().int().positive("Capacity must be a positive number").optional(),
  tags: z.array(z.string()).optional(),
  organizer: z.string().min(1, "Organizer is required").max(200, "Organizer name must be less than 200 characters").optional(),
  contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  website: urlSchema,
  registrationDeadline: z.string().optional(),
  isOnline: z.boolean().default(false),
  onlineLink: urlSchema,
});

export const updateEventSchema = createEventSchema.extend({
  id: z.string().min(1, "Event ID is required"),
});

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  firstName: z.string().min(1, "First name is required").max(100, "First name must be less than 100 characters"),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name must be less than 100 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  organization: z.string().max(200, "Organization name must be less than 200 characters").optional(),
  jobTitle: z.string().max(100, "Job title must be less than 100 characters").optional(),
  dietaryRequirements: z.string().max(500, "Dietary requirements must be less than 500 characters").optional(),
  accessibilityNeeds: z.string().max(500, "Accessibility needs must be less than 500 characters").optional(),
  additionalNotes: z.string().max(1000, "Additional notes must be less than 1000 characters").optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;

