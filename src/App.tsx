import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, AdminRoute, SpeakerRoute } from "@/components/auth/RouteGuards";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Speakers from "./pages/Speakers";
import SpeakerProfile from "./pages/SpeakerProfile";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SpeakerApply from "./pages/SpeakerApply";
import SpeakerDashboard from "./pages/SpeakerDashboard";
import EventCreate from "./pages/EventCreate";
import EventEdit from "./pages/EventEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/speakers" element={<Speakers />} />
              <Route path="/speakers/:id" element={<SpeakerProfile />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/create-event"
                element={
                  <AdminRoute>
                    <EventCreate />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/edit-event/:id"
                element={
                  <AdminRoute>
                    <EventEdit />
                  </AdminRoute>
                }
              />
              <Route path="/speaker-apply" element={<SpeakerApply />} />
              <Route
                path="/speaker-dashboard"
                element={
                  <SpeakerRoute>
                    <SpeakerDashboard />
                  </SpeakerRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ErrorBoundary>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
