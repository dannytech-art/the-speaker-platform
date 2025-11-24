import { z } from "zod";
import {
  emailSchema,
  phoneSchema,
  urlSchema,
  shortBioSchema,
  longBioSchema,
  twitterHandleSchema,
} from "@/utils/validation";

/**
 * Speaker validation schemas
 */

export const speakerApplicationSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name must be less than 100 characters"),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name must be less than 100 characters"),
  email: emailSchema,
  phone: phoneSchema,
  location: z.string().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
  title: z.string().min(1, "Professional title is required").max(200, "Title must be less than 200 characters"),
  industry: z.string().min(1, "Industry is required"),
  expertise: z
    .string()
    .min(1, "Areas of expertise are required")
    .refine(
      (val) => {
        const items = val.split(",").map((e) => e.trim()).filter(Boolean);
        return items.length > 0;
      },
      { message: "At least one area of expertise is required" }
    ),
  shortBio: shortBioSchema,
  longBio: longBioSchema,
  headshot: z.string().url("Please upload a headshot").min(1, "Headshot is required"),
  website: urlSchema,
  linkedin: urlSchema,
  twitter: twitterHandleSchema,
  facebook: urlSchema,
  experience: z.string().max(2000, "Experience description must be less than 2000 characters").optional(),
  sampleVideo: urlSchema,
  topics: z
    .string()
    .min(1, "Preferred speaking topics are required")
    .refine(
      (val) => {
        const items = val.split(",").map((t) => t.trim()).filter(Boolean);
        return items.length > 0;
      },
      { message: "At least one speaking topic is required" }
    ),
});

export const speakerUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name must be less than 100 characters").optional(),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name must be less than 100 characters").optional(),
  title: z.string().min(1, "Professional title is required").max(200, "Title must be less than 200 characters").optional(),
  industry: z.string().min(1, "Industry is required").optional(),
  shortBio: shortBioSchema.optional(),
  longBio: longBioSchema.optional(),
  location: z.string().max(200, "Location must be less than 200 characters").optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  headshot: z.string().url("Invalid image URL").optional(),
  website: urlSchema,
  linkedin: urlSchema,
  twitter: twitterHandleSchema,
  facebook: urlSchema,
  expertise: z.array(z.string()).optional(),
  speakingTopics: z.array(z.string()).optional(),
});

export type SpeakerApplicationInput = z.infer<typeof speakerApplicationSchema>;
export type SpeakerUpdateInput = z.infer<typeof speakerUpdateSchema>;
