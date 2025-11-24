import { env } from "@/config/env";

type ErrorContext = Record<string, unknown> | string | undefined;

// Lazy load Sentry to avoid bundling if not configured
let sentryInitialized = false;
let captureException: ((error: Error, options?: any) => void) | null = null;

// Initialize Sentry if DSN is configured (optional dependency)
const initializeSentry = async () => {
  if (sentryInitialized || !env.VITE_SENTRY_DSN || env.VITE_APP_ENV !== "production") {
    return;
  }

  try {
    // Dynamically import Sentry only if needed
    // Use Function constructor to prevent Vite from statically analyzing
    const sentryModule = "@sentry/react";
    // @ts-ignore - Dynamic import with runtime string
    const importFn = new Function("specifier", "return import(specifier)");
    const sentry = await importFn(sentryModule).catch(() => null);
    
    // Check if import was successful and has required methods
    if (!sentry || !sentry.init) {
      console.warn("[ErrorLogger] @sentry/react not installed. Install it with: npm install @sentry/react");
      return;
    }

    sentry.init({
      dsn: env.VITE_SENTRY_DSN,
      environment: env.VITE_APP_ENV,
      integrations: [],
      tracesSampleRate: 1.0,
      beforeSend(event) {
        // Don't send events in development
        if (env.VITE_APP_ENV !== "production") {
          return null;
        }
        return event;
      },
    });

    captureException = sentry.captureException || null;
    sentryInitialized = true;
  } catch (error) {
    console.warn("[ErrorLogger] Failed to initialize Sentry:", error);
  }
};

// Initialize on module load if in production (with error handling)
try {
  if (env.VITE_SENTRY_DSN && env.VITE_APP_ENV === "production") {
    void initializeSentry();
  }
} catch (error) {
  // Silently fail - don't block app initialization
  console.warn("[ErrorLogger] Failed to initialize Sentry on module load:", error);
}

export const logError = (error: unknown, context?: ErrorContext) => {
  const errorContext = typeof context === "string" ? { message: context } : context;

  // Log to console in non-production environments
  if (env.VITE_APP_ENV !== "production") {
    console.error("[ErrorLogger]", { error, context: errorContext });
  }

  // Send to Sentry in production if configured (fire and forget)
  if (env.VITE_SENTRY_DSN && env.VITE_APP_ENV === "production") {
    // Ensure Sentry is initialized (fire and forget)
    if (!sentryInitialized) {
      void initializeSentry().then(() => {
        if (captureException) {
          try {
            if (error instanceof Error) {
              captureException(error, {
                contexts: {
                  custom: errorContext as Record<string, unknown>,
                },
              });
            } else {
              captureException(new Error(String(error)), {
                contexts: {
                  custom: errorContext as Record<string, unknown>,
                },
              });
            }
          } catch (sentryError) {
            console.error("[ErrorLogger] Sentry logging failed:", sentryError);
          }
        }
      });
    } else if (captureException) {
      try {
        if (error instanceof Error) {
          captureException(error, {
            contexts: {
              custom: errorContext as Record<string, unknown>,
            },
          });
        } else {
          captureException(new Error(String(error)), {
            contexts: {
              custom: errorContext as Record<string, unknown>,
            },
          });
        }
      } catch (sentryError) {
        console.error("[ErrorLogger] Sentry logging failed:", sentryError);
      }
    }
  }
};

