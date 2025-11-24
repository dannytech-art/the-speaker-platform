import { ApiError, NetworkError, TimeoutError } from "@/services/api/errors";
import { getErrorMessage } from "./errorMessages";
import { logError } from "@/services/errorLogger";

type ErrorHandlingOptions = {
  fallbackMessage?: string;
  context?: string;
};

export const handleError = (error: unknown, options?: ErrorHandlingOptions) => {
  logError(error, options?.context);

  if (error instanceof ApiError) {
    return getErrorMessage(error.status);
  }

  if (error instanceof TimeoutError) {
    return "The request timed out. Please check your connection and try again.";
  }

  if (error instanceof NetworkError) {
    // More helpful error message for network errors
    const errorMessage = error.message || "";
    if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
      return "Unable to connect to the authentication service. Please check your internet connection and ensure Supabase is properly configured.";
    }
    return "We couldn't reach the server. Please check your connection and try again.";
  }

  if (error instanceof Error) {
    return error.message || options?.fallbackMessage || getErrorMessage();
  }

  return options?.fallbackMessage || getErrorMessage();
};

