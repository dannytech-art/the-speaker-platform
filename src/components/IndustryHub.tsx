import { Briefcase, Users, Laptop, DollarSign, Building, GraduationCap, Heart, Tv, Rocket, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const IndustryHub = () => {
  const industries = [
    { icon: Briefcase, name: "Business", color: "from-primary to-primary/70" },
    { icon: Users, name: "Leadership", color: "from-accent to-accent/70" },
    { icon: Laptop, name: "Tech", color: "from-primary to-primary/70" },
    { icon: DollarSign, name: "Finance", color: "from-accent to-accent/70" },
    { icon: Building, name: "Politics", color: "from-primary to-primary/70" },
    { icon: Scale, name: "Government", color: "from-accent to-accent/70" },
    { icon: GraduationCap, name: "Education", color: "from-primary to-primary/70" },
    { icon: Heart, name: "Health", color: "from-accent to-accent/70" },
    { icon: Tv, name: "Entertainment", color: "from-primary to-primary/70" },
    { icon: Rocket, name: "Entrepreneurship", color: "from-accent to-accent/70" },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Explore By Industry
          </h2>
          <p className="text-muted-foreground text-lg">
            Find events and speakers in your field of interest
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {industries.map((industry, index) => (
            <Link
              key={index}
              to="/events"
              className="group"
            >
              <div
                className="relative p-6 rounded-xl border border-border bg-card hover:border-transparent transition-all duration-300 cursor-pointer animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative flex flex-col items-center space-y-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${industry.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <industry.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {industry.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryHub;
