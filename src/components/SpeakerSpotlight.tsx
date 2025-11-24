import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import speaker1 from "@/assets/speaker-1.jpg";
import speaker2 from "@/assets/speaker-2.jpg";
import speaker3 from "@/assets/speaker-3.jpg";

const SpeakerSpotlight = () => {
  const speakers = [
    {
      id: 1,
      name: "Dr. Amara Okafor",
      title: "Tech Innovation Leader",
      image: speaker1,
      industry: "Technology",
      verified: true,
    },
    {
      id: 2,
      name: "Kwame Mensah",
      title: "Business Strategy Expert",
      image: speaker2,
      industry: "Business",
      verified: true,
    },
    {
      id: 3,
      name: "Zainab Adeyemi",
      title: "Leadership Coach",
      image: speaker3,
      industry: "Leadership",
      verified: true,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Speaker Spotlight
          </h2>
          <p className="text-muted-foreground text-lg">
            Meet Africa's most influential voices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <Card
              key={speaker.id}
              className="group relative overflow-hidden border-border hover:border-primary transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 0.1}s`,
                transform: "translateZ(0)",
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-500" />
              
              <div className="relative p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary transition-all duration-300 shadow-lg">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {speaker.verified && (
                      <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {speaker.name}
                    </h3>
                    <p className="text-muted-foreground">{speaker.title}</p>
                    <Badge variant="outline" className="border-primary text-primary">
                      {speaker.industry}
                    </Badge>
                  </div>

                  <Link to={`/speakers/${speaker.id}`} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/speakers">
            <Button
              size="lg"
              className="bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
            >
              View All Speakers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SpeakerSpotlight;
