import { env } from "@/config/env";
import { ApiError, NetworkError, TimeoutError } from "./errors";
import type { ApiClientConfig, ApiRequestOptions, ApiResponse, HttpMethod } from "./types";
import { runRequestInterceptors, runResponseInterceptors } from "./interceptors";

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
};

class ApiClient {
  private config: ApiClientConfig;

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseUrl: config?.baseUrl ?? env.VITE_API_BASE_URL,
      timeout: config?.timeout ?? env.VITE_API_TIMEOUT,
    };
  }

  private buildUrl(path: string, query?: ApiRequestOptions["query"]) {
    const url = new URL(path, this.config.baseUrl);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  private createAbortController(timeout: number) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    return { controller, timer };
  }

  async request<T = unknown>(options: ApiRequestOptions): Promise<ApiResponse<T>> {
    const mergedOptions: ApiRequestOptions = {
      method: "GET",
      timeout: this.config.timeout,
      parseJson: true,
      ...options,
    };

    const finalOptions = await runRequestInterceptors(mergedOptions);
    const url = this.buildUrl(finalOptions.path, finalOptions.query);
    const timeout = finalOptions.timeout ?? this.config.timeout;
    const { controller, timer } = this.createAbortController(timeout);

    try {
      // Don't set Content-Type for FormData - browser will set it with boundary
      const isFormData = finalOptions.body instanceof FormData;
      const headers: Record<string, string> = isFormData
        ? { ...((finalOptions.headers as Record<string, string>) ?? {}) }
        : {
            ...DEFAULT_HEADERS,
            ...((finalOptions.headers as Record<string, string>) ?? {}),
          };

      const response = await fetch(url, {
        ...finalOptions,
        signal: controller.signal,
        headers,
      });
      clearTimeout(timer);

      const isJsonResponse = response.headers.get("content-type")?.includes("application/json");
      const data = finalOptions.parseJson && isJsonResponse ? await response.json() : await response.text();

      if (!response.ok) {
        throw new ApiError(typeof data === "string" ? data : data?.message ?? "Request failed", response.status, data);
      }

      return runResponseInterceptors<T>({
        data: data as T,
        status: response.status,
        headers: response.headers,
      });
    } catch (error) {
      clearTimeout(timer);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new TimeoutError(timeout);
      }

      throw new NetworkError(error instanceof Error ? error.message : "Unknown network error");
    }
  }

  get<T>(path: string, options?: Omit<ApiRequestOptions, "path" | "method">) {
    return this.request<T>({ path, method: "GET", ...options });
  }

  delete<T>(path: string, options?: Omit<ApiRequestOptions, "path" | "method">) {
    return this.request<T>({ path, method: "DELETE", ...options });
  }

  post<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "path" | "method" | "body">) {
    // Handle FormData - don't stringify or set Content-Type
    const isFormData = body instanceof FormData;
    
    return this.request<T>({
      path,
      method: "POST",
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      parseJson: options?.parseJson ?? !isFormData,
      ...options,
      headers: isFormData 
        ? { ...((options?.headers as Record<string, string>) ?? {}) } // Don't set Content-Type for FormData
        : {
            ...((options?.headers as Record<string, string>) ?? {}),
          },
    });
  }

  put<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "path" | "method" | "body">) {
    return this.request<T>({
      path,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  patch<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "path" | "method" | "body">) {
    return this.request<T>({
      path,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }
}

export const apiClient = new ApiClient();
export type { ApiRequestOptions, ApiResponse, HttpMethod } from "./types";

