import { z } from "zod";

const envSchema = z.object({
  VITE_APP_ENV: z.enum(["local", "development", "staging", "production"]).default("local"),
  VITE_APP_NAME: z.string().min(1),
  VITE_API_BASE_URL: z.string().url(),
  VITE_API_TIMEOUT: z.coerce.number().int().positive().default(30000),
  VITE_ENABLE_ANALYTICS: z
    .union([z.boolean(), z.string()])
    .transform((value) => {
      if (typeof value === "boolean") return value;
      return value === "true";
    })
    .default(false),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_STRIPE_PUBLIC_KEY: z.string().optional(),
  // Supabase Configuration
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  const errors = parsedEnv.error.flatten().fieldErrors;
  console.error("❌ Invalid environment configuration detected:", errors);
  throw new Error("Invalid environment configuration. Check your .env files.");
}

export const env = {
  ...parsedEnv.data,
  // Provide defaults for Supabase if not configured
  SUPABASE_URL: parsedEnv.data.VITE_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: parsedEnv.data.VITE_SUPABASE_ANON_KEY || "",
};

