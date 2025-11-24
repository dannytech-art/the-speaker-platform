import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/services/eventService";
import type {
  CreateEventPayload,
  EventFilters,
  EventItem,
  EventRegistrationPayload,
  UpdateEventPayload,
} from "@/types/event";
import { toast } from "@/components/ui/use-toast";

export const useEvents = (filters: EventFilters) => {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: () => eventService.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useEvent = (id?: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => (id ? eventService.getById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
};

export const useEventMutations = () => {
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: (payload: CreateEventPayload) => eventService.create(payload),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.setQueryData<EventItem[]>(["events", {}], (old) => (old ? [event, ...old] : [event]));
      toast({ title: "Event created", description: `${event.title} has been added.` });
    },
  });

  const updateEvent = useMutation({
    mutationFn: (payload: UpdateEventPayload) => eventService.update(payload),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", event.id] });
      toast({ title: "Event updated", description: `${event.title} has been updated.` });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: (id: string) => eventService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.removeQueries({ queryKey: ["event", id] });
      toast({ title: "Event removed", description: "The event has been deleted." });
    },
  });

  const registerForEvent = useMutation({
    mutationFn: (payload: EventRegistrationPayload) => eventService.register(payload),
    onSuccess: () => {
      toast({ title: "Registration complete", description: "Check your email for confirmation." });
    },
  });

  return { createEvent, updateEvent, deleteEvent, registerForEvent };
};

