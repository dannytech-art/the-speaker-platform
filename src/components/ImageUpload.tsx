import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadService } from "@/services/uploadService";
import { logError } from "@/services/errorLogger";

interface ImageUploadProps {
  label?: string;
  description?: string;
  value?: string | null;
  onChange?: (url: string | null) => void;
  className?: string;
  folder?: string;
  rounded?: boolean;
  required?: boolean;
  error?: string;
}

export const ImageUpload = ({
  label,
  description,
  value,
  onChange,
  className,
  folder = "uploads",
  rounded = false,
  required = false,
  error,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload PNG, JPG, or WEBP images.");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const response = await uploadService.uploadImage(file, { folder });
      setUploading(false);
      onChange?.(response.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      setUploading(false);
      logError(error, { context: "ImageUpload:handleFileSelect", fileName: file.name });
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image. Please try again.";
      toast.error(errorMessage);
      setPreview(null);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const previewUrl = useMemo(() => {
    return preview || value || null;
  }, [preview, value]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div className="space-y-3">
        {previewUrl ? (
          <div className="relative inline-block">
            <div
              className={cn(
                "relative overflow-hidden border-2 border-border",
                rounded ? "rounded-full w-24 h-24" : "rounded-lg w-full max-w-xs aspect-video"
              )}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className={cn(
                  "w-full h-full object-cover",
                  rounded && "rounded-full"
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50",
              error && "border-destructive"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {!previewUrl && !uploading && (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Image
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

