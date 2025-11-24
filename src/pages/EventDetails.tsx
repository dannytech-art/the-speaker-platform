import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Share2, Heart, Users, AlertCircle, CalendarPlus } from "lucide-react";
import { useParams, Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import EventRegistrationModal from "@/components/EventRegistrationModal";
import ShareDialog from "@/components/ShareDialog";
import { useEvent, useEventMutations } from "@/hooks/useEvents";
import { useSavedEvents, useUserDashboard } from "@/hooks/useUserDashboard";
import { useAuth } from "@/hooks/useAuth";
import { downloadICSFile, generateGoogleCalendarUrl, generateOutlookCalendarUrl } from "@/utils/calendarUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EventDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  
  const { data: event, isLoading, error } = useEvent(id);
  const { data: dashboardData } = useUserDashboard();
  const { registerForEvent } = useEventMutations();
  const { add: saveEvent, remove: removeSavedEvent } = useSavedEvents();
  
  const isSaved = event && dashboardData?.savedEvents
    ? dashboardData.savedEvents.some((saved) => saved.id === event.id)
    : false;

  if (error) {
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

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save events");
      return;
    }
    
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

  const handleRegister = async (payload: { name: string; email: string; phone?: string }) => {
    try {
      await registerForEvent.mutateAsync({
        eventId: event.id,
        ...payload,
      });
      setRegistrationOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8 animate-fade-in">
              {/* Banner */}
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src={event.image || "/src/assets/event-tech.jpg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className="bg-accent text-accent-foreground shadow-lg">
                    {event.price}
                  </Badge>
                </div>
              </div>

              {/* Title and Actions */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-primary text-primary">
                      {event.category}
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                      {event.title}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setShareOpen(true)}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleSave}
                      className={isSaved ? "text-primary" : ""}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>

                {event.attendees && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} registered attendees</span>
                  </div>
                )}
              </div>

              {/* About */}
              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">About This Event</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              {/* Agenda */}
              {event.agenda && event.agenda.length > 0 && (
                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Event Agenda</h2>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="text-primary font-semibold whitespace-nowrap">
                            {item.time}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{item.title}</div>
                            {item.speaker && (
                              <div className="text-sm text-muted-foreground">{item.speaker}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Speakers */}
              {event.speakerProfiles && event.speakerProfiles.length > 0 && (
                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Featured Speakers</h2>
                    <div className="grid gap-4">
                      {event.speakerProfiles.map((speaker) => (
                        <Link
                          key={speaker.id}
                          to={`/speakers/${speaker.id}`}
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <Avatar className="w-16 h-16">
                            <img src={speaker.image} alt={speaker.name} />
                          </Avatar>
                          <div>
                            <div className="font-semibold text-foreground">{speaker.name}</div>
                            <div className="text-sm text-muted-foreground">{speaker.title}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-border animate-fade-in">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <div className="font-semibold text-foreground">Date</div>
                        <div className="text-sm text-muted-foreground">{event.date}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <div className="font-semibold text-foreground">Time</div>
                        <div className="text-sm text-muted-foreground">{event.time}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <div className="font-semibold text-foreground">Location</div>
                        <div className="text-sm text-muted-foreground">{event.location}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border space-y-3">
                    <Button 
                      className="w-full bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
                      onClick={() => setRegistrationOpen(true)}
                    >
                      {event.isFree ? "Register for Free" : `Register - ${event.price}`}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <CalendarPlus className="w-4 h-4 mr-2" />
                          Add to Calendar
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => downloadICSFile(event)}>
                          Download .ics file
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={generateGoogleCalendarUrl(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer"
                          >
                            Add to Google Calendar
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={generateOutlookCalendarUrl(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer"
                          >
                            Add to Outlook
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="pt-6 border-t border-border text-center text-sm text-muted-foreground">
                    Event link will be sent via email upon registration
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
