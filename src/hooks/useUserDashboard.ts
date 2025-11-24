import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import type { SavedEventSummary } from "@/types/dashboard";
import { toast } from "@/components/ui/use-toast";

export const useUserDashboard = () =>
  useQuery({
    queryKey: ["user-dashboard"],
    queryFn: () => userService.getDashboard(),
    staleTime: 2 * 60 * 1000,
  });

export const useSavedEvents = () => {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: (event: SavedEventSummary) => userService.saveEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
      toast({ title: "Event saved", description: "We'll remind you before it starts." });
    },
    onError: (error) => {
      toast({
        title: "Unable to save event",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => userService.removeSavedEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
      toast({ title: "Removed from saved events" });
    },
  });

  return { add, remove };
};
