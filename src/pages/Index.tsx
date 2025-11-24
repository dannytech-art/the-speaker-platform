import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import QuickDiscovery from "@/components/QuickDiscovery";
import FeaturedEvents from "@/components/FeaturedEvents";
import AdBanner from "@/components/AdBanner";
import IndustryHub from "@/components/IndustryHub";
import SpeakerSpotlight from "@/components/SpeakerSpotlight";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <QuickDiscovery />
      <FeaturedEvents />
      <AdBanner />
      <IndustryHub />
      <SpeakerSpotlight />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
