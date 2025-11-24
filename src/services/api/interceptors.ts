import type { ApiRequestOptions, ApiResponse, RequestInterceptor, ResponseInterceptor } from "./types";

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

export const registerRequestInterceptor = (interceptor: RequestInterceptor) => {
  requestInterceptors.push(interceptor);
};

export const registerResponseInterceptor = (interceptor: ResponseInterceptor) => {
  responseInterceptors.push(interceptor);
};

export const clearInterceptors = () => {
  requestInterceptors.length = 0;
  responseInterceptors.length = 0;
};

export const runRequestInterceptors = async (options: ApiRequestOptions) => {
  let updatedOptions = options;
  for (const interceptor of requestInterceptors) {
    updatedOptions = await interceptor(updatedOptions);
  }
  return updatedOptions;
};

export const runResponseInterceptors = async <T>(response: ApiResponse<T>) => {
  let updatedResponse = response;
  for (const interceptor of responseInterceptors) {
    updatedResponse = await interceptor(updatedResponse);
  }
  return updatedResponse;
};

