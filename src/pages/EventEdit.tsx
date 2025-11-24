import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMemo, useEffect } from "react";
import { useEvent, useEventMutations } from "@/hooks/useEvents";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateEventSchema, type UpdateEventInput } from "@/schemas/eventSchema";
import { FormField, FormTextarea, FormSelect } from "@/components/FormField";
import { FormErrorSummary } from "@/components/FormErrorMessage";
import { ImageUpload } from "@/components/ImageUpload";
import { sanitizeEventPayload } from "@/utils/sanitize";
import type { UpdateEventPayload } from "@/types/event";

const categoryOptions = [
  { value: "Technology", label: "Technology" },
  { value: "Finance", label: "Finance" },
  { value: "Leadership", label: "Leadership" },
  { value: "Business", label: "Business" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
];

const EventEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: event, isLoading } = useEvent(id);
  const { updateEvent, isPending } = useEventMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UpdateEventInput>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      id: id ?? "",
      title: "",
      date: "",
      time: "",
      location: "",
      category: "",
      description: "",
      price: 0,
      image: "",
    },
  });

  useEffect(() => {
    if (!event) return;
    reset({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      description: event.description || "",
      price: parseFloat(event.price?.replace("$", "") || "0") || 0,
      image: event.image || "",
    });
  }, [event, reset]);

  const category = watch("category");
  const imageValue = watch("image");
  const errorMessages = useMemo(() => (
    Object.fromEntries(
      Object.entries(errors).map(([key, value]) => [key, (value as { message?: string })?.message as string | undefined]),
    )
  ), [errors]);

  const onSubmit = async (data: UpdateEventInput) => {
    if (!id) return;

    const sanitized = sanitizeEventPayload({ ...data, id });

    const payload: UpdateEventPayload = {
      id,
      title: sanitized.title,
      date: sanitized.date,
      time: sanitized.time,
      location: sanitized.location,
      category: sanitized.category,
      description: sanitized.description,
      price: typeof sanitized.price === "number" ? sanitized.price : parseFloat(String(sanitized.price)) || 0,
      image: sanitized.image,
    };

    try {
      await updateEvent.mutateAsync(payload);
      navigate("/admin");
    } catch (error) {
      // Error handled by mutation toast
    }
  };

  if (isLoading || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Skeleton className="h-12 w-64 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Edit Event
            </h1>
            <p className="text-muted-foreground">
              Update event details
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.keys(errors).length > 0 && (
                  <FormErrorSummary errors={errorMessages} />
                )}

                <FormField
                  id="title"
                  label="Event Title"
                  required
                  error={errors.title?.message}
                  {...register("title")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id="date"
                    label="Date"
                    type="date"
                    required
                    error={errors.date?.message}
                    {...register("date")}
                  />
                  <FormField
                    id="time"
                    label="Time"
                    type="time"
                    required
                    error={errors.time?.message}
                    {...register("time")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id="location"
                    label="Location"
                    required
                    error={errors.location?.message}
                    {...register("location")}
                  />
                  <FormSelect
                    id="category"
                    label="Category"
                    required
                    value={category}
                    onValueChange={(value) => setValue("category", value)}
                    error={errors.category?.message}
                    options={categoryOptions}
                  />
                </div>

                <FormTextarea
                  id="description"
                  label="Description"
                  rows={6}
                  required
                  error={errors.description?.message}
                  {...register("description")}
                />

                <FormField
                  id="price"
                  label="Ticket Price"
                  type="number"
                  min="0"
                  step="0.01"
                  error={errors.price?.message}
                  {...register("price", { valueAsNumber: true })}
                />

                <ImageUpload
                  label="Event Image"
                  description="PNG, JPG or WEBP up to 5MB"
                  value={imageValue}
                  onChange={(url) => setValue("image", url ?? "", { shouldValidate: true })}
                  folder="events"
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-primary text-primary-foreground"
                    disabled={isPending}
                  >
                    {isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventEdit;
