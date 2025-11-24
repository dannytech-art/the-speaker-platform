import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useEventMutations } from "@/hooks/useEvents";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, type CreateEventInput } from "@/schemas/eventSchema";
import { FormField, FormTextarea, FormSelect } from "@/components/FormField";
import { FormErrorSummary } from "@/components/FormErrorMessage";
import { ImageUpload } from "@/components/ImageUpload";
import { sanitizeEventPayload } from "@/utils/sanitize";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { CreateEventPayload } from "@/types/event";

const categoryOptions = [
  { value: "Technology", label: "Technology" },
  { value: "Finance", label: "Finance" },
  { value: "Leadership", label: "Leadership" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
  { value: "Marketing", label: "Marketing" },
  { value: "Entrepreneurship", label: "Entrepreneurship" },
  { value: "Innovation", label: "Innovation" },
];

const EventCreate = () => {
  const navigate = useNavigate();
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);
  const { createEvent, isPending } = useEventMutations();
  const { data: speakers = [] } = useSpeakers({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      price: 0,
      isOnline: false,
      image: "",
    },
  });

  const category = watch("category");
  const imageValue = watch("image");
  const errorMessages = useMemo(() => (
    Object.fromEntries(
      Object.entries(errors).map(([key, value]) => [key, (value as { message?: string })?.message as string | undefined]),
    )
  ), [errors]);

  const handleSpeakerSelect = (speakerId: string) => {
    if (!selectedSpeakers.includes(speakerId)) {
      setSelectedSpeakers(prev => [...prev, speakerId]);
    }
  };

  const removeSpeaker = (speakerId: string) => {
    setSelectedSpeakers(prev => prev.filter(id => id !== speakerId));
  };

  const onSubmit = async (data: CreateEventInput) => {
    const sanitized = sanitizeEventPayload({
      ...data,
      speakerIds: selectedSpeakers,
    });

    const payload: CreateEventPayload = {
      title: sanitized.title,
      date: sanitized.date,
      time: sanitized.time,
      location: sanitized.location,
      category: sanitized.category,
      description: sanitized.description,
      price: typeof sanitized.price === "number" ? sanitized.price : parseFloat(String(sanitized.price)) || 0,
      speakerIds: selectedSpeakers,
      image: sanitized.image || undefined,
      capacity: sanitized.capacity,
      tags: sanitized.tags,
      organizer: sanitized.organizer,
      contactEmail: sanitized.contactEmail || undefined,
      contactPhone: sanitized.contactPhone,
      website: sanitized.website || undefined,
      registrationDeadline: sanitized.registrationDeadline,
      isOnline: sanitized.isOnline,
      onlineLink: sanitized.onlineLink || undefined,
    };

    try {
      await createEvent.mutateAsync(payload);
      navigate("/admin");
    } catch (error) {
      // Error handled by mutation toast
    }
  };

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
              Create New Event
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to create a new event
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
                  placeholder="African Tech Innovation Summit 2024"
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
                    placeholder="Lagos, Nigeria"
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

                <div className="space-y-2">
                  <Label>Select Speakers</Label>
                  {selectedSpeakers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedSpeakers.map(speakerId => {
                        const speaker = speakers.find(s => s.id === speakerId);
                        return speaker ? (
                          <Badge key={speakerId} variant="secondary" className="gap-1">
                            {speaker.name}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeSpeaker(speakerId)}
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  <Command className="rounded-lg border border-border">
                    <CommandInput placeholder="Search speakers..." />
                    <CommandList>
                      <CommandEmpty>No speakers found.</CommandEmpty>
                      <CommandGroup>
                        {speakers
                          .filter(speaker => !selectedSpeakers.includes(speaker.id))
                          .map((speaker) => (
                            <CommandItem
                              key={speaker.id}
                              value={speaker.name}
                              onSelect={() => handleSpeakerSelect(speaker.id)}
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{speaker.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {speaker.title}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>

                <FormTextarea
                  id="description"
                  label="Description"
                  placeholder="Event description..."
                  rows={6}
                  required
                  error={errors.description?.message}
                  {...register("description")}
                />

                <FormField
                  id="price"
                  label="Ticket Price"
                  type="number"
                  placeholder="0"
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
                    {isPending ? "Creating..." : "Create Event"}
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

export default EventCreate;
