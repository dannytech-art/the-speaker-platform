import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Calendar, DollarSign, TrendingUp, Eye, MousePointerClick, Upload, Download, Trash2, CheckSquare, Plus, Edit, FolderOpen, BarChart3, Activity, UserCheck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { exportToCSV } from "@/utils/exportUtils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { adminService } from "@/services/adminService";
import { AdEditingDialog } from "@/components/AdEditingDialog";
import type { AdminCategory, AdminAd } from "@/types/admin";
import type { SpeakerProfile } from "@/types/speaker";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, error } = useAdminDashboard();
  const [uploading, setUploading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", color: "#6366f1" });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  
  // Local state for managing categories, speakers, and ads
  const [localCategories, setLocalCategories] = useState<AdminCategory[]>([]);
  const [localSpeakers, setLocalSpeakers] = useState<SpeakerProfile[]>([]);
  const [localAds, setLocalAds] = useState<AdminAd[]>([]);
  const [editingAd, setEditingAd] = useState<AdminAd | null>(null);
  const [adDialogOpen, setAdDialogOpen] = useState(false);

  // Keyboard shortcuts - MUST be called before any early returns (Rules of Hooks)
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrlKey: true,
      callback: () => navigate('/admin/create-event'),
      description: 'Create new event'
    }
  ]);

  // Initialize local state from dashboard data
  useEffect(() => {
    if (dashboardData) {
      if (localCategories.length === 0 && dashboardData.categories) {
        setLocalCategories(dashboardData.categories);
      }
      if (localSpeakers.length === 0 && dashboardData.speakers) {
        setLocalSpeakers(dashboardData.speakers);
      }
      if (localAds.length === 0 && dashboardData.ads) {
        setLocalAds(dashboardData.ads);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardData]); // Only re-run when dashboardData changes, not local state

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
            <p className="text-muted-foreground">Failed to load admin dashboard data.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { stats, events = [] } = dashboardData;
  const speakers = localSpeakers.length > 0 ? localSpeakers : (dashboardData?.speakers || []);
  const categories = localCategories.length > 0 ? localCategories : (dashboardData?.categories || []);
  
  // Ensure stats has all required properties with safe defaults
  const safeStats = {
    totalEvents: stats?.totalEvents || 0,
    registrationsToday: stats?.registrationsToday || 0,
    revenueThisMonth: stats?.revenueThisMonth || 0,
    growthThisWeek: stats?.growthThisWeek || 0,
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEvents(events.map(e => e.id));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (eventId: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, eventId]);
    } else {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedEvents.length === 0) return;
    toast.success(`Deleted ${selectedEvents.length} event(s)`);
    setSelectedEvents([]);
  };

  const handleExportEvents = () => {
    exportToCSV(events, 'events');
    toast.success('Events exported successfully');
  };

  const handleSpeakerAction = (speakerId: string, action: "approve" | "reject") => {
    setLocalSpeakers(localSpeakers.filter(s => s.id !== speakerId));
    toast.success(`Speaker ${action}ed successfully`);
  };

  const handleAdUpload = () => {
    setEditingAd(null);
    setAdDialogOpen(true);
  };

  const handleAdSave = async (adData: Partial<AdminAd> & { id: string }) => {
    try {
      if (editingAd) {
        // Update existing ad via API (with automatic fallback)
        const updatedAd = await adminService.updateAd(adData.id, adData);
        setLocalAds(localAds.map(ad => ad.id === adData.id ? updatedAd : ad));
        toast.success("Ad updated successfully");
      } else {
        // Create new ad via API (with automatic fallback)
        const newAd = await adminService.createAd(adData);
        setLocalAds([...localAds, newAd]);
        toast.success("Ad created successfully");
      }
      
      setAdDialogOpen(false);
      setEditingAd(null);
    } catch (error) {
      // Additional error handling if needed
      toast.error("Failed to save ad. Please try again.");
      console.error("Ad save error:", error);
    }
  };

  const handleEditAd = (ad: AdminAd) => {
    setEditingAd(ad);
    setAdDialogOpen(true);
  };

  const handleDeactivateAd = async (adId: string) => {
    try {
      // Delete ad via API (with automatic fallback)
      await adminService.deleteAd(adId);
      setLocalAds(localAds.filter(ad => ad.id !== adId));
      toast.success("Ad deactivated successfully");
    } catch (error) {
      // Additional error handling if needed
      toast.error("Failed to deactivate ad. Please try again.");
      console.error("Ad deactivate error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your platform, events, and users
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{safeStats.totalEvents}</div>
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
                  <div className="text-2xl font-bold text-foreground">{safeStats.registrationsToday.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Registrations Today</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">${((safeStats.revenueThisMonth) / 1000).toFixed(1)}K</div>
                  <div className="text-sm text-muted-foreground">Revenue This Month</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{speakers.length}</div>
                  <div className="text-sm text-muted-foreground">Pending Speakers</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="speakers">Speakers</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="ads">Ads</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Events</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/admin/create-event")}
                    >
                      + New Event
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {events.length > 0 ? (
                      <div className="space-y-3">
                        {events.slice(0, 5).map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">{event.title}</h4>
                              <div className="text-sm text-muted-foreground">
                                {event.date} • {event.attendees || 0} registrations
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/admin/edit-event/${event.id}`)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/events/${event.id}`)}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                        {events.length > 5 && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              const eventsTab = document.querySelector('[value="events"]') as HTMLElement;
                              eventsTab?.click();
                            }}
                          >
                            View All Events ({events.length})
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No events yet</p>
                        <Button onClick={() => navigate("/admin/create-event")}>
                          Create Your First Event
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Platform Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-primary" />
                          <span className="text-sm">Page Views</span>
                        </div>
                        <span className="font-semibold">12,345</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <MousePointerClick className="w-5 h-5 text-accent" />
                          <span className="text-sm">Ad Clicks</span>
                        </div>
                        <span className="font-semibold">567</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-primary" />
                          <span className="text-sm">New Users</span>
                        </div>
                        <span className="font-semibold">89</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Event Management</CardTitle>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleExportEvents}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Export events</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="bg-gradient-primary text-primary-foreground"
                            onClick={() => navigate("/admin/create-event")}
                          >
                            + Create Event
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Create new event (Ctrl+N)</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Bulk Actions Bar */}
                  {selectedEvents.length > 0 && (
                    <div className="mb-4 p-3 bg-primary/10 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {selectedEvents.length} event(s) selected
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected
                      </Button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Select All */}
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Checkbox
                        checked={selectedEvents.length === events.length}
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm font-medium">Select All</span>
                    </div>

                    {/* Event List */}
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={selectedEvents.includes(event.id)}
                            onCheckedChange={(checked) =>
                              handleSelectEvent(event.id, checked as boolean)
                            }
                          />
                          <div className="w-16 h-16 bg-primary/10 rounded-lg" />
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {event.title}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              {event.date} • {event.attendees || 0} registrations
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/edit-event/${event.id}`)}
                                >
                                  Edit
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit event details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View event page</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => toast.success("Event deleted")}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete event</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Event Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Category Form */}
                  <div className="border border-border rounded-lg p-4 bg-muted/20">
                    <h3 className="font-semibold text-foreground mb-4">
                      {editingCategory ? "Edit Category" : "Add New Category"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input
                          id="categoryName"
                          placeholder="e.g., Technology"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryDescription">Description</Label>
                        <Input
                          id="categoryDescription"
                          placeholder="Brief description"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryColor">Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="categoryColor"
                            type="color"
                            value={newCategory.color}
                            onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                            className="w-16 h-10"
                          />
                          <Button
                            onClick={() => {
                              if (newCategory.name.trim()) {
                                if (editingCategory) {
                                  setLocalCategories(prev => prev.map(cat => 
                                    cat.id.toString() === editingCategory 
                                      ? { ...cat, ...newCategory }
                                      : cat
                                  ));
                                  setEditingCategory(null);
                                  toast.success("Category updated successfully!");
                                } else {
                                  setLocalCategories(prev => [...prev, { 
                                    id: Math.max(...prev.map(c => c.id), 0) + 1,
                                    ...newCategory 
                                  }]);
                                  toast.success("Category added successfully!");
                                }
                                setNewCategory({ name: "", description: "", color: "#6366f1" });
                              } else {
                                toast.error("Please enter a category name");
                              }
                            }}
                            className="bg-primary text-primary-foreground"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {editingCategory ? "Update" : "Add"}
                          </Button>
                          {editingCategory && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingCategory(null);
                                setNewCategory({ name: "", description: "", color: "#6366f1" });
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories List */}
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <FolderOpen 
                              className="w-6 h-6" 
                              style={{ color: category.color }}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCategory(category.id.toString());
                              setNewCategory({
                                name: category.name,
                                description: category.description,
                                color: category.color
                              });
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setLocalCategories(prev => prev.filter(cat => cat.id !== category.id));
                              toast.success("Category deleted successfully!");
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="speakers" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Speaker Approval Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {speakers.length > 0 ? speakers.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10" />
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {speaker.name}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              {speaker.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {speaker.location} • {speaker.industry}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/speakers/${speaker.id}`)}
                          >
                            View Profile
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-primary text-primary-foreground"
                            onClick={() => handleSpeakerAction(speaker.id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive"
                            onClick={() => handleSpeakerAction(speaker.id, "reject")}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <p className="text-muted-foreground text-center py-8">
                        No pending speaker applications
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Verified Speakers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10" />
                          <div>
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                              Dr. Amara Okafor
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">✓</span>
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              15 events • 2,500 followers
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/speakers/${item}`)}
                          >
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">Suspend</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="search"
                        placeholder="Search users..."
                        className="flex-1 px-4 py-2 border border-border rounded-lg"
                      />
                      <Button variant="outline">Filter</Button>
                    </div>
                    
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-4 text-sm font-medium">User</th>
                            <th className="text-left p-4 text-sm font-medium">Email</th>
                            <th className="text-left p-4 text-sm font-medium">Role</th>
                            <th className="text-left p-4 text-sm font-medium">Joined</th>
                            <th className="text-right p-4 text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {[1, 2, 3, 4].map((item) => (
                            <tr key={item} className="hover:bg-muted/30 transition-colors">
                              <td className="p-4">John Doe</td>
                              <td className="p-4 text-muted-foreground">john@example.com</td>
                              <td className="p-4">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">User</span>
                              </td>
                              <td className="p-4 text-muted-foreground">Jan 15, 2024</td>
                              <td className="p-4 text-right">
                                <Button variant="outline" size="sm">Manage</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ads" className="space-y-6">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Active Advertisements</CardTitle>
                  <Button 
                    className="bg-gradient-primary text-primary-foreground"
                    onClick={handleAdUpload}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "+ Upload Ad"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {localAds.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No active advertisements</p>
                        <p className="text-sm mt-2">Click "+ Upload Ad" to create your first ad</p>
                      </div>
                    ) : (
                      localAds.map((ad) => (
                        <div
                          key={ad.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-4">
                            {ad.image ? (
                              <img
                                src={ad.image}
                                alt={ad.title}
                                className="w-32 h-20 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-32 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FolderOpen className="w-8 h-8 text-primary/50" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {ad.title}
                              </h3>
                              <div className="text-sm text-muted-foreground">
                                Active until {ad.activeUntil || "N/A"} • {ad.impressions.toLocaleString()} impressions • {ad.clicks.toLocaleString()} clicks
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditAd(ad)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => handleDeactivateAd(ad.id)}
                            >
                              Deactivate
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Ad Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="text-sm text-muted-foreground mb-1">Total Impressions</div>
                      <div className="text-2xl font-bold text-foreground">45,678</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="text-sm text-muted-foreground mb-1">Total Clicks</div>
                      <div className="text-2xl font-bold text-foreground">2,345</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="text-sm text-muted-foreground mb-1">Click Rate</div>
                      <div className="text-2xl font-bold text-foreground">5.1%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Key Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 className="w-8 h-8 text-primary" />
                      <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">+12.5%</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">24,567</div>
                    <div className="text-sm text-muted-foreground">Total Events</div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-accent" />
                      <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">+8.2%</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">145,823</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <UserCheck className="w-8 h-8 text-primary" />
                      <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">+15.3%</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">1,842</div>
                    <div className="text-sm text-muted-foreground">Verified Speakers</div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8 text-accent" />
                      <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">+18.7%</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">$2.4M</div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                  </CardContent>
                </Card>
              </div>

              {/* Traffic & Engagement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Traffic Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Page Views</span>
                        <span className="font-semibold text-foreground">1,234,567</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Unique Visitors</span>
                        <span className="font-semibold text-foreground">456,789</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: "68%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Bounce Rate</span>
                        <span className="font-semibold text-foreground">32.4%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: "32%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="font-semibold text-foreground">12.8%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      User Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-primary/10">
                        <div className="text-2xl font-bold text-foreground mb-1">4.2 min</div>
                        <div className="text-sm text-muted-foreground">Avg. Session</div>
                      </div>
                      <div className="p-4 rounded-lg bg-accent/10">
                        <div className="text-2xl font-bold text-foreground mb-1">3.8</div>
                        <div className="text-sm text-muted-foreground">Pages/Session</div>
                      </div>
                      <div className="p-4 rounded-lg bg-green-500/10">
                        <div className="text-2xl font-bold text-foreground mb-1">68%</div>
                        <div className="text-sm text-muted-foreground">Returning Users</div>
                      </div>
                      <div className="p-4 rounded-lg bg-orange-500/10">
                        <div className="text-2xl font-bold text-foreground mb-1">32%</div>
                        <div className="text-sm text-muted-foreground">New Users</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Category Performance */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: "Technology", events: 8542, registrations: 45678, revenue: "$856K", growth: "+22%" },
                      { category: "Leadership", events: 5234, registrations: 32145, revenue: "$612K", growth: "+18%" },
                      { category: "Finance", events: 4156, registrations: 28934, revenue: "$524K", growth: "+15%" },
                      { category: "Business", events: 3892, registrations: 24567, revenue: "$468K", growth: "+12%" },
                    ].map((item, index) => (
                      <div key={index} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-foreground">{item.category}</h3>
                          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">{item.growth}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Events</div>
                            <div className="font-semibold text-foreground">{item.events.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Registrations</div>
                            <div className="font-semibold text-foreground">{item.registrations.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Revenue</div>
                            <div className="font-semibold text-foreground">{item.revenue}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Events */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Top Performing Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "African Tech Summit 2024", registrations: 2850, revenue: "$142K", rating: 4.9 },
                      { name: "Leadership Excellence Forum", registrations: 2340, revenue: "$117K", rating: 4.8 },
                      { name: "FinTech Innovation Conference", registrations: 2120, revenue: "$106K", rating: 4.7 },
                      { name: "Business Growth Masterclass", registrations: 1980, revenue: "$99K", rating: 4.8 },
                      { name: "Digital Transformation Summit", registrations: 1750, revenue: "$87K", rating: 4.6 },
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{event.name}</div>
                            <div className="text-xs text-muted-foreground">⭐ {event.rating}</div>
                          </div>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <div className="text-muted-foreground">Registrations</div>
                            <div className="font-semibold text-foreground">{event.registrations.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Revenue</div>
                            <div className="font-semibold text-foreground">{event.revenue}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AdEditingDialog
        open={adDialogOpen}
        onOpenChange={setAdDialogOpen}
        ad={editingAd}
        onSave={handleAdSave}
      />

      <Footer />
    </div>
  );
};

export default AdminDashboard;
