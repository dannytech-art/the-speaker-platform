import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Search, Grid, List as ListIcon, Download, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { exportToCSV } from "@/utils/exportUtils";
import { toast } from "sonner";

import eventsData from "@/data/events.json";
import { useEvents } from "@/hooks/useEvents";
import type { EventItem } from "@/types/event";

// Function to shorten long category names
const shortenCategory = (category: string | string[]): string => {
  if (Array.isArray(category)) {
    // Take the first category if it's an array
    category = category[0] || '';
  }
  
  if (typeof category !== 'string') return 'Event';
  
  // Handle comma-separated categories by taking the first one
  if (category.includes(',')) {
    category = category.split(',')[0].trim();
  }
  
  // Common category abbreviations
  const abbreviations: { [key: string]: string } = {
    'concerts and music': 'Music',
    'hunterian': 'Hunterian',
    'exhibitions': 'Exhibitions',
    'public lectures': 'Lectures',
    'staff workshops and seminars': 'Workshops',
    'student events': 'Students',
    'academic events': 'Academic',
    'community events': 'Community',
    'social events': 'Social',
    'conferences': 'Conference',
    'open days and visits': 'Open Day',
    'alumni events': 'Alumni',
    'ceremonial events': 'Ceremony',
    'films and theatre': 'Film & Theatre'
  };

  const lowerCategory = category.toLowerCase().trim();
  
  // Return abbreviation if exists, otherwise truncate
  if (abbreviations[lowerCategory]) {
    return abbreviations[lowerCategory];
  }

  // For long categories, take first word or truncate
  if (category.length > 15) {
    const firstWord = category.split(' ')[0];
    if (firstWord.length <= 12) {
      return firstWord;
    }
    return category.substring(0, 12) + '...';
  }

  return category;
};

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useKeyboardShortcuts([
    { key: "k", ctrlKey: true, callback: () => document.getElementById("search-input")?.focus() },
    { key: "g", callback: () => setViewMode("grid") },
    { key: "l", callback: () => setViewMode("list") },
  ]);

  const filters = useMemo(
    () => ({
      search: searchQuery || undefined,
      category: selectedCategory,
      price: selectedPrice,
    }),
    [searchQuery, selectedCategory, selectedPrice]
  );

  const { data: backendEvents = [], isLoading: backendLoading } = useEvents();

  // MERGE + FILTER EVENTS
  const combinedEvents = useMemo(() => {
    let events = [...backendEvents, ...eventsData];

    if (filters.category !== "all") {
      events = events.filter((e) => {
        if (typeof e.category === 'string') {
          return e.category === filters.category;
        } else if (Array.isArray(e.category)) {
          return e.category.includes(filters.category);
        }
        return false;
      });
    }

    if (filters.price !== "all") {
      events = events.filter((e) =>
        filters.price === "free" ? e.isFree : !e.isFree
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      events = events.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        (Array.isArray(e.speakers)
          ? e.speakers.some((s) =>
              (typeof s === "string" ? s : s.name).toLowerCase().includes(q)
            )
          : typeof e.speakers === "string"
          ? e.speakers.toLowerCase().includes(q)
          : e.speakers?.name?.toLowerCase().includes(q))
      );
    }

    return events;
  }, [backendEvents, filters]);

  // SIMPLIFIED: Just use events as they are - images are already in the JSON data
  const eventsWithImages = useMemo(() => {
    return combinedEvents.map((event, i) => ({
      ...event,
      id: event.id || event.url || `event-${i}`,
      // The image is already in the JSON data, no need for getEventImage
    }));
  }, [combinedEvents]);

  // Handle image load
  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => new Set(prev.add(imageUrl)));
  };

  // Handle image error with simple colored fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, event: any) => {
    const target = e.target as HTMLImageElement;
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600', 
      'from-orange-500 to-red-600',
      'from-purple-500 to-pink-600',
      'from-teal-500 to-blue-600',
      'from-red-500 to-orange-600'
    ];
    const colorClass = colors[Math.floor(Math.random() * colors.length)];
    
    // Replace the image with a colored div
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="w-full h-full bg-gradient-to-br ${colorClass} flex items-center justify-center">
          <div class="text-center text-white p-4">
            <div class="w-12 h-12 mx-auto mb-2 opacity-80 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p class="font-semibold text-lg">${event.title}</p>
            <p class="text-sm opacity-90 mt-1">${Array.isArray(event.category) ? event.category.join(', ') : event.category}</p>
          </div>
        </div>
      `;
    }
  };

  if (backendLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold">Discover Events</h1>
            <p className="text-muted-foreground">Explore upcoming speaking events across Africa</p>
          </div>

          {/* SEARCH + FILTERS */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="search-input"
                  placeholder="Search events or speakers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-4 flex-wrap">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Concerts and music">Concerts & Music</SelectItem>
                    <SelectItem value="Hunterian">Hunterian</SelectItem>
                    <SelectItem value="Exhibitions">Exhibitions</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Price" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          exportToCSV(eventsWithImages, "events");
                          toast.success("Exported!");
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export to CSV</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* EVENTS LIST */}
          {eventsWithImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found matching your criteria.</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? 
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : 
              "space-y-4"
            }>
              {eventsWithImages.map((event, i) => (
                <Card key={event.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden bg-muted relative">
                    {!loadedImages.has(event.image) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Skeleton className="w-full h-full" />
                      </div>
                    )}
                    <img
                      src={event.image}
                      alt={event.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        loadedImages.has(event.image) ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => handleImageLoad(event.image)}
                      onError={(e) => handleImageError(e, event)}
                    />
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="outline" 
                              className="border-primary text-primary max-w-[100px] truncate flex-shrink-0"
                            >
                              {shortenCategory(event.category)}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{Array.isArray(event.category) ? event.category.join(', ') : event.category}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <span className="text-xs text-muted-foreground max-w-[100px] truncate flex-shrink-0">
                        {Array.isArray(event.speakers)
                          ? event.speakers.map((s) => (typeof s === "string" ? s : s.name)).join(", ")
                          : event.speakers}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold line-clamp-2">{event.title}</h3>

                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" /> 
                        <span className="truncate">{event.date}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" /> 
                          <span className="truncate">{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" /> 
                        <span className="truncate">{event.venue || event.location}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <Link to={`/events/${event.id}`} className="w-full">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Events;