import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { AdminAd } from "@/types/admin";

const adSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  image: z.string().url("Valid image URL is required").optional().or(z.literal("")),
  link: z.string().url("Valid URL is required").optional().or(z.literal("")),
  activeUntil: z.string().min(1, "Active until date is required"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

type AdFormValues = z.infer<typeof adSchema>;

interface AdEditingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad?: AdminAd | null;
  onSave: (adData: Partial<AdminAd> & { id: string }) => void;
}

export const AdEditingDialog = ({ open, onOpenChange, ad, onSave }: AdEditingDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(ad?.image || null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: ad?.title || "",
      image: ad?.image || "",
      link: "",
      activeUntil: ad?.activeUntil || "",
      description: "",
    },
  });

  // Reset form when ad changes
  useEffect(() => {
    if (ad) {
      reset({
        title: ad.title || "",
        image: ad.image || "",
        link: "",
        activeUntil: ad.activeUntil || "",
        description: "",
      });
      setImageUrl(ad.image || null);
    } else {
      reset({
        title: "",
        image: "",
        link: "",
        activeUntil: "",
        description: "",
      });
      setImageUrl(null);
    }
  }, [ad, reset]);

  const onSubmit = async (data: AdFormValues) => {
    try {
      const adData: Partial<AdminAd> & { id: string } = {
        id: ad?.id || `ad-${Date.now()}`,
        title: data.title.trim(),
        image: imageUrl || undefined,
        activeUntil: data.activeUntil,
        impressions: ad?.impressions || 0,
        clicks: ad?.clicks || 0,
      };

      onSave(adData);
      toast.success(ad ? "Ad updated successfully" : "Ad created successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save ad");
    }
  };

  const handleImageChange = (url: string | null) => {
    setImageUrl(url);
    setValue("image", url || "", { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ad ? "Edit Advertisement" : "Create Advertisement"}</DialogTitle>
          <DialogDescription>
            {ad ? "Update the advertisement details below." : "Create a new advertisement for the platform."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Banner Ad - Homepage"
              {...register("title")}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the advertisement..."
              rows={3}
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <ImageUpload
            label="Ad Image"
            description="Upload an image for the advertisement (PNG, JPG, WEBP up to 5MB)"
            value={imageUrl}
            onChange={handleImageChange}
            folder="ads"
          />

          <div className="space-y-2">
            <Label htmlFor="link">Destination URL (Optional)</Label>
            <Input
              id="link"
              type="url"
              placeholder="https://example.com"
              {...register("link")}
              className={errors.link ? "border-destructive" : ""}
            />
            {errors.link && <p className="text-sm text-destructive">{errors.link.message}</p>}
            <p className="text-xs text-muted-foreground">Where users will be redirected when clicking the ad</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activeUntil">
              Active Until <span className="text-destructive">*</span>
            </Label>
            <Input
              id="activeUntil"
              type="date"
              {...register("activeUntil")}
              className={errors.activeUntil ? "border-destructive" : ""}
            />
            {errors.activeUntil && <p className="text-sm text-destructive">{errors.activeUntil.message}</p>}
          </div>

          {ad && (
            <div className="p-4 rounded-lg bg-muted/30 space-y-2">
              <h4 className="font-semibold text-foreground">Performance Stats</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Impressions:</span>
                  <span className="ml-2 font-semibold">{ad.impressions.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Clicks:</span>
                  <span className="ml-2 font-semibold">{ad.clicks.toLocaleString()}</span>
                </div>
                {ad.impressions > 0 && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Click Rate:</span>
                    <span className="ml-2 font-semibold">
                      {((ad.clicks / ad.impressions) * 100).toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : ad ? "Update Ad" : "Create Ad"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

