import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadService } from "../uploadService";
import { apiClient } from "@/services/api/apiClient";

vi.mock("@/services/api/apiClient");

describe("uploadService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("uploadImage", () => {
    it("should validate file size", async () => {
      const largeFile = new File(["x".repeat(10 * 1024 * 1024)], "large.jpg", { type: "image/jpeg" });
      
      await expect(uploadService.uploadImage(largeFile)).rejects.toThrow("exceeds maximum");
    });

    it("should validate file type", async () => {
      const invalidFile = new File(["content"], "file.txt", { type: "text/plain" });
      
      await expect(uploadService.uploadImage(invalidFile)).rejects.toThrow("not allowed");
    });

    it("should upload valid image file", async () => {
      const validFile = new File(["content"], "image.jpg", { type: "image/jpeg" });
      const mockResponse = { data: { url: "https://example.com/image.jpg" } };
      
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse as any);
      
      const result = await uploadService.uploadImage(validFile);
      
      expect(result.url).toBe("https://example.com/image.jpg");
      expect(apiClient.post).toHaveBeenCalledWith(
        "/upload/image",
        expect.any(FormData),
        expect.any(Object)
      );
    });
  });
});

