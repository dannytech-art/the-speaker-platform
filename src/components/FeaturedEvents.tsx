import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import eventTech from "@/assets/event-tech.jpg";
import eventLeadership from "@/assets/event-leadership.jpg";
import eventFinance from "@/assets/event-finance.jpg";

const FeaturedEvents = () => {
  const events = [
    {
      id: 1,
      title: "African Tech Innovation Summit 2024",
      image: eventTech,
      date: "March 15, 2024",
      time: "10:00 AM WAT",
      location: "Online",
      price: "Free",
      isFree: true,
      category: "Technology",
    },
    {
      id: 2,
      title: "Leadership & Governance Masterclass",
      image: eventLeadership,
      date: "March 20, 2024",
      time: "2:00 PM WAT",
      location: "Online",
      price: "$49",
      isFree: false,
      category: "Leadership",
    },
    {
      id: 3,
      title: "Finance & Investment Summit",
      image: eventFinance,
      date: "March 25, 2024",
      time: "11:00 AM WAT",
      location: "Online",
      price: "$79",
      isFree: false,
      category: "Finance",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Featured Events
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't miss these upcoming events from top speakers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Card
              key={event.id}
              className="group relative overflow-hidden border-border hover:border-primary transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
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
                  <Badge variant="outline" className="border-primary text-primary">
                    {event.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
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

                <CardFooter className="p-6 pt-0">
                  <Link to={`/events/${event.id}`} className="w-full">
                    <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                      Register Now
                    </Button>
                  </Link>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/events">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
