import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Mic className="absolute top-1/4 left-10 w-8 h-8 text-primary/30 animate-float" />
        <Calendar className="absolute top-1/3 right-20 w-10 h-10 text-accent/30 animate-float" style={{ animationDelay: "1s" }} />
        <MapPin className="absolute bottom-1/4 left-1/4 w-6 h-6 text-primary/40 animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Animated Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="block text-foreground mb-2">Discover the Best</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
              Online Speaking Events
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn from industry leaders across business, tech, finance, governance, and more.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-card border border-border rounded-lg overflow-hidden shadow-lg">
                <Search className="w-5 h-5 text-muted-foreground ml-4" />
                <Input
                  type="text"
                  placeholder="Search events, speakers, or topics..."
                  className="flex-1 border-0 focus-visible:ring-0 bg-transparent"
                />
                <Link to="/events">
                  <Button className="m-2 bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/events">
              <Button
                size="lg"
                className="bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90 px-8"
              >
                Browse Events
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 px-8"
              >
                Create Account
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Events</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-accent">200+</div>
              <div className="text-sm text-muted-foreground">Speakers</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Attendees</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
