import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Users, AlertCircle } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import EventRegistrationModal from "@/components/EventRegistrationModal";
import ShareDialog from "@/components/ShareDialog";
import { useEventMutations } from "@/hooks/useEvents";
import { useSavedEvents, useUserDashboard } from "@/hooks/useUserDashboard";
import { useAuth } from "@/hooks/useAuth";

// ✅ Import JSON
import eventsData from "@/data/events.json";
import { useEvent } from "@/hooks/useEvents"; // hook for backend events
import type { EventItem } from "@/types/event";

const EventDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const { data: backendEvent, isLoading, error } = useEvent(id);
  const { data: dashboardData } = useUserDashboard();
  const { registerForEvent } = useEventMutations();
  const { add: saveEvent, remove: removeSavedEvent } = useSavedEvents();

  // ✅ Combine backend event + JSON events with string-safe comparison
  const event: EventItem | undefined = useMemo(() => {
    if (backendEvent) return backendEvent;
    return eventsData.find((e) => String(e.id) === String(id));
  }, [backendEvent, id]);

  const isSaved = event && dashboardData?.savedEvents
    ? dashboardData.savedEvents.some((saved) => String(saved.id) === String(event.id))
    : false;

  // ❌ Event not found
  if (error || (!event && !isLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-border max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-bold">Event Not Found</h2>
            <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
            <Link to="/events">
              <Button>Browse Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ⏳ Loading state
  if (isLoading || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ Save event
  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save events");
      return;
    }

    if (!event) return;

    if (isSaved) {
      removeSavedEvent.mutate(event.id);
    } else {
      saveEvent.mutate({
        id: event.id,
        title: event.title,
        date: event.date,
        image: event.image,
      });
    }
  };

  // ✅ Register event
  const handleRegister = async (payload: { name: string; email: string; phone?: string }) => {
    if (!event) return;

    if (backendEvent) {
      try {
        await registerForEvent.mutateAsync({ eventId: event.id, ...payload });
        setRegistrationOpen(false);
      } catch {}
    } else {
      toast.success(`Registered ${payload.name} for ${event.title}`);
      setRegistrationOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Card className="mb-8">
          <CardContent className="space-y-4">
            <h1 className="text-3xl font-bold">{event.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" /><span>{event.date}</span>
              <Clock className="w-4 h-4" /><span>{event.time}</span>
              <MapPin className="w-4 h-4" /><span>{event.location}</span>
            </div>

            {event.speakers && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>
                  {Array.isArray(event.speakers)
                    ? event.speakers.map(s => (typeof s === "string" ? s : s.name)).join(", ")
                    : event.speakers}
                </span>
              </div>
            )}

            {/* Save / Register Buttons */}
            <div className="flex gap-4 mt-4">
              <Button onClick={handleSave}>{isSaved ? "Unsave" : "Save Event"}</Button>
              <Button onClick={() => setRegistrationOpen(true)}>Register</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <EventRegistrationModal
        open={registrationOpen}
        onOpenChange={setRegistrationOpen}
        event={{
          title: event.title,
          price: event.price,
          isFree: event.isFree,
          date: event.date,
          time: event.time,
        }}
        onRegister={handleRegister}
      />

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        title={event.title}
        url={`/events/${id}`}
      />

      <Footer />
    </div>
  );
};

export default EventDetails;
