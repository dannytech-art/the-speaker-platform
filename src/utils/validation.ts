import { z } from "zod";

/**
 * Common validation patterns and utilities
 */

// Email validation
export const emailSchema = z.string().email("Invalid email address").min(1, "Email is required");

// Phone validation (supports international formats)
export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");

// URL validation
export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .optional()
  .or(z.literal(""));

// Date validation (must be in the future for events)
export const futureDateSchema = z
  .string()
  .min(1, "Date is required")
  .refine(
    (date) => {
      const dateObj = new Date(date);
      return dateObj > new Date();
    },
    { message: "Date must be in the future" }
  );

// Time validation
export const timeSchema = z.string().min(1, "Time is required");

// Price validation (non-negative number)
export const priceSchema = z
  .number()
  .nonnegative("Price must be non-negative")
  .or(z.string().transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    return num;
  }));

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// Twitter handle validation
export const twitterHandleSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || val.startsWith("@") || /^[a-zA-Z0-9_]{1,15}$/.test(val),
    { message: "Invalid Twitter handle" }
  );

// Bio length validation
export const shortBioSchema = z
  .string()
  .min(10, "Short bio must be at least 10 characters")
  .max(200, "Short bio must be less than 200 characters");

export const longBioSchema = z
  .string()
  .min(50, "Full biography must be at least 50 characters")
  .max(5000, "Full biography must be less than 5000 characters");

// File validation helpers
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Image validation
export const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => validateFileType(file, ["image/jpeg", "image/png", "image/webp", "image/jpg"]),
    { message: "File must be an image (JPEG, PNG, or WEBP)" }
  )
  .refine(
    (file) => validateFileSize(file, 5),
    { message: "Image size must be less than 5MB" }
  )
  .optional();

// Validation error formatter
export const formatValidationError = (error: z.ZodError): Record<string, string> => {
  const formatted: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    formatted[path] = err.message;
  });
  return formatted;
};

// Common validation messages
export const validationMessages = {
  required: "This field is required",
  email: "Invalid email address",
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be less than ${max} characters`,
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be less than ${max}`,
  url: "Invalid URL format",
  phone: "Invalid phone number format",
  futureDate: "Date must be in the future",
  positive: "Must be a positive number",
  nonNegative: "Must be a non-negative number",
};

