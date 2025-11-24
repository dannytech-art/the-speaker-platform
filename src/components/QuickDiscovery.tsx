import { Button } from "@/components/ui/button";
import { TrendingUp, Star, Clock, DollarSign, Award } from "lucide-react";
import { Link } from "react-router-dom";

const QuickDiscovery = () => {
  const categories = [
    { icon: TrendingUp, label: "Trending Events", color: "text-primary" },
    { icon: Star, label: "Top Speakers", color: "text-accent" },
    { icon: Clock, label: "New This Week", color: "text-primary" },
    { icon: DollarSign, label: "Free Events", color: "text-accent" },
    { icon: Award, label: "Paid Masterclasses", color: "text-primary" },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <Link key={index} to="/events">
              <Button
                variant="outline"
                className="group relative overflow-hidden border-border hover:border-primary transition-all duration-300 px-6 py-6 h-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <category.icon className={`w-5 h-5 ${category.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-medium text-foreground">{category.label}</span>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickDiscovery;
