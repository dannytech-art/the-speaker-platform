import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Heart, User, Bell, Settings, Ticket, Trash2, Download, CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { exportToCSV } from "@/utils/exportUtils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useUserDashboard, useSavedEvents } from "@/hooks/useUserDashboard";
import { downloadICSFile } from "@/utils/calendarUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EventItem } from "@/types/event";

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useUserDashboard();
  const { remove } = useSavedEvents();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'e',
      callback: () => document.getElementById('events-tab')?.click(),
      description: 'Go to events tab'
    },
    {
      key: 'p',
      callback: () => document.getElementById('profile-tab')?.click(),
      description: 'Go to profile tab'
    }
  ]);

  const handleExportSaved = () => {
    if (dashboardData?.savedEvents) {
      exportToCSV(dashboardData.savedEvents, 'saved-events');
      toast.success('Saved events exported');
    }
  };

  const handleRemoveSaved = async (eventId: string) => {
    try {
      await remove.mutateAsync(eventId);
    } catch (error) {
      // Error handled by mutation toast
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-12 w-64 mb-8" />
            <Skeleton className="h-96 w-full" />
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

  const { registeredEvents = [], savedEvents = [], notifications = [] } = dashboardData;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              My Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your events, speakers, and preferences
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{registeredEvents.length}</div>
                  <div className="text-sm text-muted-foreground">Registered Events</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{savedEvents.length}</div>
                  <div className="text-sm text-muted-foreground">Saved Events</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{notifications.length}</div>
                  <div className="text-sm text-muted-foreground">Notifications</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">0</div>
                  <div className="text-sm text-muted-foreground">Following Speakers</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger id="events-tab" value="events">My Events</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="speakers">Following</TabsTrigger>
              <TabsTrigger id="profile-tab" value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {registeredEvents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No registered events</p>
                  ) : (
                    registeredEvents.map((event) => (
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
                            </div>
                            <Badge className="bg-primary text-primary-foreground">
                              Registered
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Link to={`/events/${event.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <CalendarPlus className="w-4 h-4 mr-2" />
                                  Add to Calendar
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={() => downloadICSFile(event as EventItem)}>
                                  Download .ics file
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Saved Events</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleExportSaved}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Export saved events</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedEvents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No saved events</p>
                  ) : (
                    savedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <Link to={`/events/${event.id}`} className="flex gap-4 flex-1">
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">
                              {event.title}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              {event.date}
                            </div>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSaved(event.id)}
                          disabled={remove.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="speakers">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Following Speakers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    You're not following any speakers yet
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
  <Card className="border border-border/40 backdrop-blur-xl bg-background/60 shadow-lg">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
      <p className="text-sm text-muted-foreground mt-1">
        Customize your experience, notifications, and preferences
      </p>
    </CardHeader>

    <CardContent className="space-y-10">

      {/* Notification Section */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">Notifications</h3>

        <div className="space-y-4">

          {/* Setting Item */}
          <div className="group flex items-center justify-between p-4 rounded-xl border border-border/30 bg-muted/30 hover:bg-muted/50 transition-all">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Get updates about new events & announcements
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="group flex items-center justify-between p-4 rounded-xl border border-border/30 bg-muted/30 hover:bg-muted/50 transition-all">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium">Event Reminders</p>
                <p className="text-xs text-muted-foreground">
                  Receive reminders before your events start
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="group flex items-center justify-between p-4 rounded-xl border border-border/30 bg-muted/30 hover:bg-muted/50 transition-all">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Speaker Updates</p>
                <p className="text-xs text-muted-foreground">
                  Alerts when followed speakers post new events
                </p>
              </div>
            </div>
            <Switch />
          </div>

        </div>
      </section>

      {/* Profile Mini Settings */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">Profile</h3>

        <div className="space-y-4">

          <div className="flex items-center justify-between p-4 rounded-xl border border-border/30 bg-muted/30 hover:bg-muted/50 transition-all">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">
                  Automatically switch theme based on your system
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 pt-6 border-t border-border/30">
        <p className="text-sm text-muted-foreground">Danger Zone</p>

        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-red-500">Delete Account</p>
              <p className="text-xs text-red-500/70">
                This action is permanent and cannot be undone
              </p>
            </div>
          </div>

          <Button variant="destructive">Delete</Button>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-gradient-primary px-6 text-primary-foreground shadow-md">
          Save Changes
        </Button>
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

export default Dashboard;
