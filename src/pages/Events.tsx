import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Search, Filter, Grid, List as ListIcon, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { exportToCSV } from "@/utils/exportUtils";
import { toast } from "sonner";
import { useEvents } from "@/hooks/useEvents";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      callback: () => document.getElementById('search-input')?.focus(),
      description: 'Focus search'
    },
    {
      key: 'g',
      callback: () => setViewMode('grid'),
      description: 'Grid view'
    },
    {
      key: 'l',
      callback: () => setViewMode('list'),
      description: 'List view'
    }
  ]);
  const filters = useMemo(
    () => ({
      search: searchQuery || undefined,
      category: selectedCategory,
      price: selectedPrice,
    }),
    [searchQuery, selectedCategory, selectedPrice],
  );

  const { data: events = [], isLoading } = useEvents(filters);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Discover Events
            </h1>
            <p className="text-muted-foreground">
              Explore upcoming speaking events across Africa
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="search-input"
                    placeholder="Search events, speakers, or topics... (Ctrl+K)"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
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
                          exportToCSV(events, "events");
                          toast.success('Events exported to CSV');
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

          {/* Event Grid/List Controls */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {events.length} events
            </p>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Grid view (G)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                    >
                      <ListIcon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>List view (L)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-border">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
            {events.map((event, index) => (
              <Card
                key={event.id}
                className="group relative overflow-hidden border-border hover:border-primary transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-500" />
                
                <div className="relative">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge
                        className={
                          event.isFree
                            ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow-gold)]"
                            : "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                        }
                      >
                        {event.price}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-primary text-primary">
                        {event.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{event.speakers}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 gap-2">
                    <Link to={`/events/${event.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </div>
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
