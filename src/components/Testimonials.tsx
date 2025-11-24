import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Adekunle",
      role: "Entrepreneur",
      rating: 5,
      text: "AfricaElections connected me with industry leaders I never thought I'd have access to. The events are world-class.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      name: "Michael Nwosu",
      role: "Tech Professional",
      rating: 5,
      text: "The quality of speakers and content is exceptional. I've attended over 20 events and each one delivers value.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      name: "Fatima Diallo",
      role: "Business Owner",
      rating: 5,
      text: "This platform has become my go-to for professional development. The free events alone are worth it!",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Our Community Says
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied attendees
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border hover:border-primary transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
