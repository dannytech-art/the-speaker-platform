import { Button } from "@/components/ui/button";

type ErrorFallbackProps = {
  error?: Error;
  reset?: () => void;
};

export const ErrorFallback = ({ error, reset }: ErrorFallbackProps) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted px-4 text-center">
    <div>
      <p className="text-sm uppercase tracking-wide text-muted-foreground">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-semibold text-foreground">We couldn&apos;t load this page</h1>
      {error?.message && (
        <p className="mt-4 text-muted-foreground">
          Details: <span className="font-mono">{error.message}</span>
        </p>
      )}
    </div>
    <div className="flex gap-3">
      <Button onClick={() => window.location.reload()} variant="outline">
        Reload Page
      </Button>
      {reset && (
        <Button onClick={reset} className="bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]">
          Try Again
        </Button>
      )}
    </div>
  </div>
);

