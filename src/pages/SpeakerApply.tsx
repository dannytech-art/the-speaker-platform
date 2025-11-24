import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSpeakerActions } from "@/hooks/useSpeakers";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "@/components/ImageUpload";
import { speakerApplicationSchema, type SpeakerApplicationInput } from "@/schemas/speakerSchema";
import { sanitizeSpeakerPayload } from "@/utils/sanitize";
import type { SpeakerApplicationPayload } from "@/types/speaker";

const SpeakerApply = () => {
  const navigate = useNavigate();
  const { apply } = useSpeakerActions();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SpeakerApplicationInput>({
    resolver: zodResolver(speakerApplicationSchema),
    defaultValues: { headshot: "" },
  });

  const headshotValue = watch("headshot");

  const onSubmit = async (data: SpeakerApplicationInput) => {
    const sanitized = sanitizeSpeakerPayload(data);
    const expertiseArray = sanitized.expertise.split(",").map((e) => e.trim()).filter(Boolean);
    const topicsArray = sanitized.topics.split(",").map((t) => t.trim()).filter(Boolean);
    
    const payload: SpeakerApplicationPayload = {
      firstName: sanitized.firstName,
      lastName: sanitized.lastName,
      email: sanitized.email,
      phone: sanitized.phone,
      location: sanitized.location,
      title: sanitized.title,
      industry: sanitized.industry,
      expertise: expertiseArray,
      shortBio: sanitized.shortBio,
      longBio: sanitized.longBio,
      headshot: sanitized.headshot,
      website: sanitized.website || undefined,
      linkedin: sanitized.linkedin || undefined,
      twitter: sanitized.twitter || undefined,
      facebook: sanitized.facebook || undefined,
      experience: sanitized.experience || undefined,
      sampleVideo: sanitized.sampleVideo || undefined,
      topics: topicsArray,
    };

    try {
      await apply.mutateAsync(payload);
      // Success state will be handled by the mutation toast
      navigate("/");
    } catch (error) {
      // Error handled by mutation toast
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Become a Speaker
              </h1>
              <p className="text-muted-foreground text-lg">
                Share your expertise with Africa's largest event community
              </p>
            </div>

            <Card className="border-border animate-fade-in">
              <CardHeader>
                <CardTitle>Speaker Application</CardTitle>
                <CardDescription>
                  Fill out the form below to apply. We'll review your application and contact you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          placeholder="John" 
                          {...register("firstName")}
                          className={errors.firstName ? "border-destructive" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-destructive">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe" 
                          {...register("lastName")}
                          className={errors.lastName ? "border-destructive" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-destructive">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        {...register("email")}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+234 800 000 0000" 
                        {...register("phone")}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location (City, Country) *</Label>
                      <Input 
                        id="location" 
                        placeholder="Lagos, Nigeria" 
                        {...register("location")}
                        className={errors.location ? "border-destructive" : ""}
                      />
                      {errors.location && (
                        <p className="text-sm text-destructive">{errors.location.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title *</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g., Tech Innovation Leader" 
                        {...register("title")}
                        className={errors.title ? "border-destructive" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground">Professional Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry">Primary Industry *</Label>
                      <Select 
                        onValueChange={(value) => setValue("industry", value)}
                        required
                      >
                        <SelectTrigger className={errors.industry ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Leadership">Leadership</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Politics">Politics</SelectItem>
                          <SelectItem value="Government">Government</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.industry && (
                        <p className="text-sm text-destructive">{errors.industry.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expertise">Areas of Expertise (comma-separated) *</Label>
                      <Input 
                        id="expertise" 
                        placeholder="e.g., AI, Digital Transformation, Innovation Strategy" 
                        {...register("expertise")}
                        className={errors.expertise ? "border-destructive" : ""}
                      />
                      {errors.expertise && (
                        <p className="text-sm text-destructive">{errors.expertise.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortBio">Short Bio (Max 200 characters) *</Label>
                      <Textarea 
                        id="shortBio" 
                        placeholder="Brief description for event listings..."
                        maxLength={200}
                        {...register("shortBio")}
                        className={errors.shortBio ? "border-destructive" : ""}
                      />
                      {errors.shortBio && (
                        <p className="text-sm text-destructive">{errors.shortBio.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longBio">Full Biography *</Label>
                      <Textarea 
                        id="longBio" 
                        placeholder="Detailed professional background, achievements, and experience..."
                        rows={6}
                        {...register("longBio")}
                        className={errors.longBio ? "border-destructive" : ""}
                      />
                      {errors.longBio && (
                        <p className="text-sm text-destructive">{errors.longBio.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Media & Links */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground">Media & Social Links</h3>
                    
                    <ImageUpload
                      label="Professional Headshot *"
                      description="PNG, JPG or WEBP up to 5MB"
                      value={headshotValue}
                      onChange={(url) => setValue("headshot", url ?? "", { shouldValidate: true })}
                      folder="speakers/headshots"
                      rounded
                    />
                    {errors.headshot && (
                      <p className="text-sm text-destructive">{errors.headshot.message}</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          type="url" 
                          placeholder="https://yourwebsite.com" 
                          {...register("website")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin" 
                          type="url" 
                          placeholder="https://linkedin.com/in/..." 
                          {...register("linkedin")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter/X</Label>
                        <Input 
                          id="twitter" 
                          placeholder="@yourusername" 
                          {...register("twitter")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input 
                          id="facebook" 
                          type="url" 
                          placeholder="https://facebook.com/..." 
                          {...register("facebook")}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Speaking Experience */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground">Speaking Experience</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Previous Speaking Experience</Label>
                      <Textarea 
                        id="experience" 
                        placeholder="Describe your previous speaking engagements, conferences, or events..."
                        rows={4}
                        {...register("experience")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sampleVideo">Sample Video Link (YouTube, Vimeo, etc.)</Label>
                      <Input 
                        id="sampleVideo" 
                        type="url" 
                        placeholder="https://..." 
                        {...register("sampleVideo")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topics">Preferred Speaking Topics (comma-separated) *</Label>
                      <Textarea 
                        id="topics" 
                        placeholder="List the topics you'd like to speak about..."
                        rows={3}
                        {...register("topics")}
                        className={errors.topics ? "border-destructive" : ""}
                      />
                      {errors.topics && (
                        <p className="text-sm text-destructive">{errors.topics.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-6 border-t border-border">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
                      disabled={apply.isPending}
                    >
                      {apply.isPending ? "Submitting Application..." : "Submit Application"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      By submitting this form, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SpeakerApply;
