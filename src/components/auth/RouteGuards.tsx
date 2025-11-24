import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/user";

type GuardProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
};

const LoadingScreen = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="animate-spin rounded-full border-4 border-primary/30 border-t-primary p-6" role="status" aria-label="Loading" />
  </div>
);

const Guard = ({ children, allowedRoles, redirectTo = "/auth" }: GuardProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return <Guard>{children}</Guard>;
};

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  return <Guard allowedRoles={["admin"]}>{children}</Guard>;
};

export const SpeakerRoute = ({ children }: { children: ReactNode }) => {
  return <Guard allowedRoles={["speaker", "admin"]}>{children}</Guard>;
};

