import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          
          <div className="relative z-10 py-16 px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Join the Largest Event Community</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-3xl mx-auto">
              Start Your Learning Journey Today
            </h2>

            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Get access to exclusive events, connect with industry leaders, and grow your professional network.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-xl px-8 group"
                >
                  Sign Up Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8"
                >
                  Explore Events
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl text-white">✓</span>
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl text-white">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl text-white">✓</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
