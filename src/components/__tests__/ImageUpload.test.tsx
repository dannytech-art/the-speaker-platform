import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageUpload } from "../ImageUpload";

vi.mock("@/services/uploadService", () => ({
  uploadService: {
    uploadImage: vi.fn(),
  },
}));

describe("ImageUpload", () => {
  it("should render upload area when no image", () => {
    render(<ImageUpload label="Upload Image" onChange={() => {}} />);
    
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
  });

  it("should show preview when value is provided", () => {
    render(<ImageUpload label="Upload Image" value="https://example.com/image.jpg" onChange={() => {}} />);
    
    expect(screen.getByAltText("Preview")).toBeInTheDocument();
  });
});

