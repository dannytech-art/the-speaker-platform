export const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred. Please try again.";

const errorMessages: Record<number, string> = {
  400: "Invalid request. Please check your input and try again.",
  401: "You need to be signed in to continue.",
  403: "You don't have permission to perform this action.",
  404: "We couldn't find what you were looking for.",
  408: "The request took too long. Please try again.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
};

export const getErrorMessage = (status?: number) => {
  if (!status) return DEFAULT_ERROR_MESSAGE;
  return errorMessages[status] ?? DEFAULT_ERROR_MESSAGE;
};

