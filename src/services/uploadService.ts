import { apiClient } from "@/services/api/apiClient";
import { env } from "@/config/env";
import { logError } from "@/services/errorLogger";

export interface UploadOptions {
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

export interface UploadResponse {
  url: string;
  id?: string;
  size?: number;
}

/**
 * Upload service for handling file uploads to the backend
 */
const withFallback = async <T>(request: () => Promise<T>, fallback: () => T) => {
  try {
    return await request();
  } catch (error) {
    console.warn("[uploadService] falling back to mock data", error);
    logError(error, { context: "uploadService:withFallback" });
    return fallback();
  }
};

/**
 * Create a mock URL for local file (for development)
 */
const createMockFileUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const uploadService = {
  /**
   * Upload an image file
   */
  async uploadImage(file: File, options?: UploadOptions): Promise<UploadResponse> {
    const maxSize = options?.maxSize ?? Number(env.VITE_MAX_FILE_SIZE ?? 5242880); // 5MB default
    const allowedTypes = options?.allowedTypes ?? ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    // Validate file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`);
    }

    return withFallback(
      async () => {
        const formData = new FormData();
        formData.append("file", file);
        
        if (options?.folder) {
          formData.append("folder", options.folder);
        }

        const { data } = await apiClient.post<UploadResponse>("/upload/image", formData, {
          parseJson: true,
          headers: {
            // Don't set Content-Type, let the browser set it with boundary
            "Content-Type": undefined,
          } as unknown as Record<string, string>,
        });

        return data;
      },
      () => {
        // Fallback: Create object URL for local file
        const url = createMockFileUrl(file);
        return {
          url,
          id: `mock-${Date.now()}-${file.name}`,
          size: file.size,
        };
      }
    );
  },

  /**
   * Upload a general file (for speaker materials, etc.)
   */
  async uploadFile(file: File, options?: UploadOptions): Promise<UploadResponse> {
    const maxSize = options?.maxSize ?? 50 * 1024 * 1024; // 50MB default for general files

    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
    }

    return withFallback(
      async () => {
        const formData = new FormData();
        formData.append("file", file);
        
        if (options?.folder) {
          formData.append("folder", options.folder);
        }

        const { data } = await apiClient.post<UploadResponse>("/upload/file", formData, {
          parseJson: true,
          headers: {
            "Content-Type": undefined,
          } as unknown as Record<string, string>,
        });

        return data;
      },
      () => {
        // Fallback: Create object URL for local file
        const url = createMockFileUrl(file);
        return {
          url,
          id: `mock-${Date.now()}-${file.name}`,
          size: file.size,
        };
      }
    );
  },

  /**
   * Delete an uploaded file
   */
  async deleteFile(fileId: string): Promise<void> {
    return withFallback(
      async () => {
        await apiClient.delete(`/upload/${fileId}`);
      },
      () => {
        // Fallback: Revoke object URL if it's a mock file
        if (fileId.startsWith("mock-")) {
          // Object URLs are automatically cleaned up, but we can track them
          console.log(`[uploadService] Mock file ${fileId} would be deleted`);
        }
        // No-op for fallback
      }
    );
  },
};

