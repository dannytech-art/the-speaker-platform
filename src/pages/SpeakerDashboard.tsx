import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Users, Eye, TrendingUp, Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import { useSpeakerDashboard } from "@/hooks/useSpeakers";
import { useAuth } from "@/hooks/useAuth";
import { uploadService } from "@/services/uploadService";
import { logError } from "@/services/errorLogger";
import speaker1 from "@/assets/speaker-1.jpg";

const SpeakerDashboard = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading, error } = useSpeakerDashboard();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(speaker1);
  const [mediaLibrary, setMediaLibrary] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  const handleFileUpload = async (file?: File) => {
    if (!file) {
      // If no file provided, trigger file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*,video/*,.pdf,.doc,.docx";
      input.onchange = async (e) => {
        const selectedFile = (e.target as HTMLInputElement).files?.[0];
        if (selectedFile) {
          await handleFileUpload(selectedFile);
        }
      };
      input.click();
      return;
    }

    setUploading(true);
    try {
      const response = await uploadService.uploadFile(file, { folder: "speakers/media" });
      
      // Add to media library
      setMediaLibrary((prev) => [...prev, response.url]);
      
      toast.success("File uploaded successfully!");
    } catch (error) {
      logError(error, { context: "SpeakerDashboard:handleFileUpload", fileName: file.name });
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file. Please try again.";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-16 w-full mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted-foreground">Failed to load dashboard data.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { stats, upcomingEvents = [], invitations = [] } = dashboardData;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <img src={profilePhoto ?? speaker1} alt="Profile" />
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Speaker Dashboard</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground">✓ Verified</Badge>
                  Dr. Amara Okafor
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats.totalEvents}</div>
                  <div className="text-sm text-muted-foreground">Total Events</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats.followers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Followers</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats.profileViews.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Profile Views</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats.rating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Avg. Rating</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No upcoming events</p>
                  ) : (
                    upcomingEvents.map((event) => (
                      <div
                        key={event.id}
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
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">
                                {event.title}
                              </h3>
                              <div className="text-sm text-muted-foreground">
                                {event.date} {event.time && `• ${event.time}`}
                              </div>
                              {event.attendees && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {event.attendees} registered attendees
                                </div>
                              )}
                            </div>
                            <Badge className="bg-primary text-primary-foreground">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirmed
                            </Badge>
                          </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleFileUpload}
                            disabled={uploading}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? "Uploading..." : "Upload Materials"}
                          </Button>
                          <Button variant="outline" size="sm">
                            Event Details
                          </Button>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invitations" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Event Invitations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {invitations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No pending invitations</p>
                  ) : (
                    invitations.map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          {invitation.status === "pending" ? (
                            <Clock className="w-5 h-5 text-accent" />
                          ) : invitation.status === "accepted" ? (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground">{invitation.title}</h3>
                            <div className="text-sm text-muted-foreground">
                              {invitation.date} • From {invitation.organizer}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {invitation.status === "pending" && (
                            <>
                              <Button size="sm" className="bg-primary text-primary-foreground">
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                            </>
                          )}
                          {invitation.status === "accepted" && (
                            <Badge className="bg-primary text-primary-foreground">
                              Accepted
                            </Badge>
                          )}
                          {invitation.status === "declined" && (
                            <Badge variant="outline" className="border-destructive text-destructive">
                              Declined
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <ImageUpload
                      label="Profile Photo"
                      description="Update the image shown across your public speaker profile"
                      value={profilePhoto}
                      onChange={(url) => setProfilePhoto(url ?? speaker1)}
                      folder="speakers/profiles"
                      rounded
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input id="title" defaultValue="Tech Innovation Leader" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue="Lagos, Nigeria" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="short-bio">Short Bio</Label>
                      <Textarea 
                        id="short-bio" 
                        defaultValue="Tech Innovation Leader & AI Strategist"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full-bio">Full Biography</Label>
                      <Textarea 
                        id="full-bio" 
                        defaultValue="Dr. Amara Okafor is a renowned technology leader..."
                        rows={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expertise">Expertise (comma-separated)</Label>
                      <Input 
                        id="expertise" 
                        defaultValue="Artificial Intelligence, Digital Transformation, Innovation Strategy"
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" className="bg-gradient-primary text-primary-foreground">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Media Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Upload photos and videos to showcase your speaking events
                    </p>
                    <Button 
                      variant="outline"
                      onClick={handleFileUpload}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload Media"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Engagement Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-primary" />
                        <span className="font-medium">Profile Views (Last 30 days)</span>
                      </div>
                      <span className="text-2xl font-bold text-foreground">3,245</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-accent" />
                        <span className="font-medium">New Followers</span>
                      </div>
                      <span className="text-2xl font-bold text-foreground">+156</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="font-medium">Event Attendance Rate</span>
                      </div>
                      <span className="text-2xl font-bold text-foreground">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SpeakerDashboard;
