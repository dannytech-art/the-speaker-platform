import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorMessageProps {
  message: string;
  className?: string;
}

export const FormErrorMessage = ({ message, className }: FormErrorMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-destructive",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

interface FormErrorSummaryProps {
  errors: Record<string, string | undefined>;
  className?: string;
}

export const FormErrorSummary = ({ errors, className }: FormErrorSummaryProps) => {
  const errorEntries = Object.entries(errors).filter(([, message]) => message);

  if (errorEntries.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-destructive/50 bg-destructive/10 p-4 space-y-2",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 font-semibold text-destructive">
        <AlertCircle className="w-4 h-4" />
        <span>Please fix the following errors:</span>
      </div>
      <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
        {errorEntries.map(([field, message]) => (
          <li key={field}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

