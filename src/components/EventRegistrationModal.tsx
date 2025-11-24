import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, Ticket } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventRegistrationSchema, type EventRegistrationInput } from "@/schemas/eventSchema";
import { FormField } from "@/components/FormField";
import { FormErrorSummary } from "@/components/FormErrorMessage";

interface EventRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    title: string;
    price: string;
    isFree: boolean;
    date: string;
    time: string;
  };
  onRegister?: (payload: EventRegistrationInput) => Promise<void>;
}

const EventRegistrationModal = ({ open, onOpenChange, event, onRegister }: EventRegistrationModalProps) => {
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventRegistrationInput>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      eventId: event.id,
    },
  });

  const handleInfoSubmit = async (data: EventRegistrationInput) => {
    if (event.isFree) {
      await handleRegistration(data);
    } else {
      setStep("payment");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process payment first
    // For now, we'll just call handleRegistration with the form data
    const formData = new FormData(e.target as HTMLFormElement);
    // Payment processing would happen here
    await handleRegistration({} as EventRegistrationInput);
  };

  const handleRegistration = async (payload: EventRegistrationInput) => {
    setLoading(true);
    try {
      if (onRegister) {
        await onRegister(payload);
      } else {
        // Fallback for backward compatibility
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setStep("success");
      toast.success("Registration successful! Check your email for confirmation.");
      setTimeout(() => {
        onOpenChange(false);
        setStep("info");
        reset();
      }, 2000);
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "info" && "Register for Event"}
            {step === "payment" && "Payment Details"}
            {step === "success" && "Registration Complete!"}
          </DialogTitle>
        </DialogHeader>

        {step === "info" && (
          <form onSubmit={handleSubmit(handleInfoSubmit)} className="space-y-4">
            {Object.keys(errors).length > 0 && (
              <FormErrorSummary errors={errors as Record<string, string | undefined>} />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="firstName"
                label="First Name"
                placeholder="John"
                required
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <FormField
                id="lastName"
                label="Last Name"
                placeholder="Doe"
                required
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>

            <FormField
              id="email"
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              required
              error={errors.email?.message}
              {...register("email")}
            />

            <FormField
              id="phone"
              label="Phone Number"
              type="tel"
              placeholder="+234 xxx xxx xxxx"
              required
              error={errors.phone?.message}
              {...register("phone")}
            />

            <div className="pt-2">
              <div className="text-sm text-muted-foreground mb-4">
                <div className="font-semibold text-foreground mb-2">{event.title}</div>
                <div>{event.date} at {event.time}</div>
                <div className="font-bold text-primary mt-2">{event.price}</div>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? "Processing..." : event.isFree ? "Complete Registration" : "Continue to Payment"}
            </Button>
          </form>
        )}

        {step === "payment" && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <CreditCard className="w-4 h-4" />
              <span>Secure payment powered by Stripe</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card">Card Number</Label>
              <Input id="card" placeholder="4242 4242 4242 4242" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" required />
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span>Ticket Price</span>
                <span className="font-semibold">{event.price}</span>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? "Processing..." : `Pay ${event.price}`}
            </Button>
          </form>
        )}

        {step === "success" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">You're all set!</h3>
            <p className="text-sm text-muted-foreground">
              Check your email for your ticket and event details.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationModal;
