import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import type { EventItem } from "@/types/event";
import { toast } from "@/components/ui/use-toast";

export const useAdminDashboard = () =>
  useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminService.getOverview(),
  });

export const useAdminEvents = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (event: EventItem) => adminService.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast({ title: "Event added", description: "The event is now available to attendees." });
    },
  });

  return { create };
};
