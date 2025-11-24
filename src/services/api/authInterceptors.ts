import { tokenManager } from "@/utils/tokenManager";
import { registerRequestInterceptor, registerResponseInterceptor } from "./interceptors";
import type { ApiRequestOptions } from "./types";

let initialized = false;

export const initializeAuthInterceptors = () => {
  if (initialized) return;
  initialized = true;

  registerRequestInterceptor(async (options: ApiRequestOptions) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return options;
  });

  registerResponseInterceptor(async (response) => response);
};

