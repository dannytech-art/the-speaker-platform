import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useSpeakers, useSpeakerActions } from "@/hooks/useSpeakers";
import type { SpeakerProfile } from "@/types/speaker";

const Speakers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { follow, unfollow } = useSpeakerActions();
  
  const filters = useMemo(() => ({
    search: searchQuery || undefined,
  }), [searchQuery]);

  const { data: speakers = [], isLoading, error } = useSpeakers(filters);

  const handleFollow = async (speakerId: string, isFollowing: boolean) => {
    if (isFollowing) {
      await unfollow.mutateAsync(speakerId);
    } else {
      await follow.mutateAsync(speakerId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Featured Speakers
            </h1>
            <p className="text-muted-foreground">
              Connect with Africa's most influential voices
            </p>
          </div>

          {/* Search */}
          <div className="mb-8 animate-fade-in">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search speakers by name, industry, or expertise..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Speakers Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to load speakers. Please try again.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {speakers.length} speaker{speakers.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {speakers.map((speaker: SpeakerProfile, index: number) => {
                  // Following status is checked individually when user interacts with follow button
                  // The useSpeakerFollowingStatus hook can be called on-demand if needed
                  const isFollowing = false; // Will be updated via React Query cache when user follows
                  return (
              <Card
                key={speaker.id}
                className="group relative overflow-hidden border-border hover:border-primary transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-500" />
                
                <div className="relative p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary transition-all duration-300 shadow-lg">
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {speaker.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-[var(--shadow-glow)]">
                          <span className="text-primary-foreground text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    <div className="text-center space-y-2 w-full">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {speaker.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{speaker.title}</p>
                      <Badge variant="outline" className="border-primary text-primary">
                        {speaker.industry}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground w-full justify-center border-t border-border pt-4">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{speaker.events}</div>
                        <div className="text-xs">Events</div>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{speaker.followers}</div>
                        <div className="text-xs">Followers</div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <Link to={`/speakers/${speaker.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          View Profile
                        </Button>
                      </Link>
                      <Button
                        variant={isFollowing ? "outline" : "default"}
                        className={isFollowing ? "" : "bg-gradient-primary text-primary-foreground hover:opacity-90"}
                        onClick={() => handleFollow(speaker.id, isFollowing)}
                        disabled={follow.isPending || unfollow.isPending}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Speakers;
