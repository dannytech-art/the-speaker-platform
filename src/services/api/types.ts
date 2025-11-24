export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions extends RequestInit {
  path: string;
  method?: HttpMethod;
  timeout?: number;
  query?: Record<string, string | number | boolean | undefined>;
  parseJson?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface RequestInterceptor {
  (options: ApiRequestOptions): Promise<ApiRequestOptions> | ApiRequestOptions;
}

export interface ResponseInterceptor {
  <T>(response: ApiResponse<T>): Promise<ApiResponse<T>> | ApiResponse<T>;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
}

