import { X } from "lucide-react";
import { useState } from "react";

const AdBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <section className="py-12 bg-muted/30 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border border-border">
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Close ad"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Ad Content */}
          <div className="p-8 md:p-12 text-center">
            <div className="inline-block px-3 py-1 bg-accent/20 rounded-full text-xs font-medium text-accent mb-4">
              Sponsored
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Advertise Your Event Here
            </h3>
            
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Reach thousands of engaged professionals across Africa. Premium ad placements available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/admin"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shadow-[var(--shadow-glow)]"
              >
                Learn More
              </a>
              <a
                href="/events"
                className="inline-flex items-center justify-center px-6 py-3 bg-background text-foreground border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Browse Events
              </a>
            </div>

            {/* Placeholder for actual ad images */}
            <div className="mt-8 text-xs text-muted-foreground">
              Your banner ad appears here • Contact admin for pricing
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdBanner;
