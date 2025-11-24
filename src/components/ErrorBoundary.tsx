import { Component, ReactNode } from "react";
import { ErrorFallback } from "./ErrorFallback";
import { logError } from "@/services/errorLogger";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    logError(error, errorInfo);
  }

  private resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} reset={this.resetErrorBoundary} />;
    }

    return this.props.children;
  }
}

