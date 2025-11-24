import { z } from "zod";
import { emailSchema, phoneSchema, urlSchema } from "@/utils/validation";

/**
 * User profile validation schemas
 */

export const userProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name must be less than 100 characters"),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name must be less than 100 characters"),
  email: emailSchema,
  phone: phoneSchema.optional(),
  location: z.string().max(200, "Location must be less than 200 characters").optional(),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
  website: urlSchema,
  linkedin: urlSchema,
  twitter: z.string().max(50, "Twitter handle must be less than 50 characters").optional(),
  organization: z.string().max(200, "Organization name must be less than 200 characters").optional(),
  jobTitle: z.string().max(100, "Job title must be less than 100 characters").optional(),
});

export const userSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  eventReminders: z.boolean().default(true),
  speakerUpdates: z.boolean().default(true),
  newsletter: z.boolean().default(false),
  language: z.enum(["en", "fr", "sw", "ar"]).default("en"),
  timezone: z.string().min(1, "Timezone is required").default("UTC"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

