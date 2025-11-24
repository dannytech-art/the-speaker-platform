import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Share2, Facebook, Twitter, Linkedin, Globe, Mail, Video } from "lucide-react";
import { toast } from "sonner";
import { useParams, Link } from "react-router-dom";
import { useSpeaker, useSpeakerActions, useSpeakerFollowingStatus, useSpeakerEvents } from "@/hooks/useSpeakers";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import { useAuth } from "@/hooks/useAuth";
import eventTech from "@/assets/event-tech.jpg";

const SpeakerProfile = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { data: speaker, isLoading, error } = useSpeaker(id);
  const { data: dashboardData } = useUserDashboard();
  const { follow, unfollow } = useSpeakerActions();
  const { data: isFollowing = false } = useSpeakerFollowingStatus(id);
  const { data: speakerEvents = [], isLoading: eventsLoading } = useSpeakerEvents(id);
  
  const handleFollow = async () => {
    if (!id) return;
    if (!isAuthenticated) {
      toast.error("Please sign in to follow speakers");
      return;
    }
    if (isFollowing) {
      await unfollow.mutateAsync(id);
    } else {
      await follow.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-64 w-full mb-12" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !speaker) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted-foreground">Speaker not found or failed to load.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const speakerName = speaker.name || `${speaker.firstName || ""} ${speaker.lastName || ""}`.trim();
  const longBio = speaker.longBio || speaker.shortBio || "No biography available.";
  const expertise = speaker.expertise || [];
  const speakingTopics = speaker.speakingTopics || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative mb-12">
            <div className="h-64 bg-gradient-primary rounded-3xl overflow-hidden" />
            
            <div className="absolute -bottom-16 left-8 flex items-end gap-6 animate-fade-in">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-xl">
                  <img
                    src={speaker.image}
                    alt={speakerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {speaker.verified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center border-4 border-background shadow-[var(--shadow-glow)]">
                    <span className="text-primary-foreground">✓</span>
                  </div>
                )}
              </div>

              <div className="pb-4 space-y-2">
                <h1 className="text-3xl font-bold text-foreground">{speakerName}</h1>
                <p className="text-muted-foreground">{speaker.title}</p>
                <div className="flex items-center gap-4 text-sm">
                  {speaker.location && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{speaker.location}</span>
                    </div>
                  )}
                  <Badge variant="outline" className="border-primary text-primary">
                    {speaker.industry}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="absolute top-8 right-8 flex gap-2">
              <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <Card className="border-border">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-2xl font-bold text-foreground">Biography</h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {longBio}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
                      <div className="space-y-3">
                        {speaker.email && (
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Mail className="w-5 h-5 text-primary" />
                            <a href={`mailto:${speaker.email}`} className="hover:text-primary transition-colors">
                              {speaker.email}
                            </a>
                          </div>
                        )}
                        {speaker.phone && (
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href={`tel:${speaker.phone}`} className="hover:text-primary transition-colors">
                              {speaker.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-2xl font-bold text-foreground">Expertise</h2>
                      <div className="flex flex-wrap gap-2">
                        {expertise.length > 0 ? (
                          expertise.map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-primary/10 text-primary border-primary/20"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No expertise listed</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-2xl font-bold text-foreground">Speaking Topics</h2>
                      <div className="flex flex-wrap gap-2">
                        {speakingTopics.length > 0 ? (
                          speakingTopics.map((topic, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-accent text-accent"
                            >
                              {topic}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No speaking topics listed</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-2xl font-bold text-foreground">Speaking Experience</h2>
                      {speaker.previousExperience ? (
                        <p className="text-muted-foreground leading-relaxed">
                          {speaker.previousExperience}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">No experience listed</p>
                      )}
                      {speaker.sampleVideoUrl && (
                        <div className="pt-4">
                          <h3 className="text-sm font-semibold text-foreground mb-2">Sample Video</h3>
                          <a 
                            href={speaker.sampleVideoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:underline"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                            </svg>
                            Watch Sample Video
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="events" className="space-y-6">
                  <Card className="border-border">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
                      <div className="space-y-4">
                        {eventsLoading ? (
                          <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                          </div>
                        ) : speakerEvents.length > 0 ? (
                          speakerEvents.map((event) => (
                            <Link
                              key={event.id}
                              to={`/events/${event.id}`}
                              className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              {event.image && (
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-24 h-24 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                                <div className="text-sm text-muted-foreground">
                                  {event.date} {event.time && `• ${event.time}`}
                                </div>
                                <div className="text-sm text-muted-foreground">{event.location}</div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No upcoming events listed</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="media">
                  <Card className="border-border">
                    <CardContent className="p-6">
                      {speaker.sampleVideoUrl ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Sample Video</h3>
                            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                              <iframe
                                src={speaker.sampleVideoUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Speaker Sample Video"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <Video className="w-12 h-12" />
                            <p>No media available</p>
                            <p className="text-sm">Check back soon for speaker videos and photos</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-foreground">{speaker.events}</div>
                        <div className="text-sm text-muted-foreground">Total Events</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{speaker.followers}</div>
                        <div className="text-sm text-muted-foreground">Followers</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-accent">{speaker.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-accent">★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
                    onClick={handleFollow}
                    disabled={follow.isPending || unfollow.isPending}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {isFollowing ? "Unfollow Speaker" : "Follow Speaker"}
                  </Button>

                  {speaker.socialLinks && (
                    <div className="pt-6 border-t border-border space-y-3">
                      <h3 className="font-semibold text-foreground">Connect</h3>
                      <div className="flex gap-2">
                        {speaker.socialLinks.website && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={speaker.socialLinks.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {speaker.socialLinks.twitter && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={`https://twitter.com/${speaker.socialLinks.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                              <Twitter className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {speaker.socialLinks.linkedin && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={speaker.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {speaker.socialLinks.facebook && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={speaker.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                              <Facebook className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SpeakerProfile;
