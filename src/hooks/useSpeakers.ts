import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { speakerService } from "@/services/speakerService";
import type { SpeakerApplicationPayload, SpeakerFilters } from "@/types/speaker";
import { toast } from "@/components/ui/use-toast";

export const useSpeakers = (filters: SpeakerFilters) =>
  useQuery({
    queryKey: ["speakers", filters],
    queryFn: () => speakerService.list(filters),
    staleTime: 5 * 60 * 1000,
  });

export const useSpeaker = (id?: string) =>
  useQuery({
    queryKey: ["speaker", id],
    queryFn: () => (id ? speakerService.getById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });

export const useSpeakerDashboard = () =>
  useQuery({
    queryKey: ["speaker-dashboard"],
    queryFn: () => speakerService.getDashboard(),
  });

export const useSpeakerFollowingStatus = (id?: string) =>
  useQuery({
    queryKey: ["speaker-following-status", id],
    queryFn: () => (id ? speakerService.getFollowingStatus(id) : Promise.resolve(false)),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

export const useSpeakerEvents = (id?: string) =>
  useQuery({
    queryKey: ["speaker-events", id],
    queryFn: () => (id ? speakerService.getSpeakerEvents(id) : Promise.resolve([])),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useSpeakerActions = () => {
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn: (id: string) => speakerService.follow(id),
    onSuccess: async (_, id) => {
        await queryClient.invalidateQueries({ queryKey: ["speakers"] });
        await queryClient.invalidateQueries({ queryKey: ["speaker", id] });
        await queryClient.invalidateQueries({ queryKey: ["speaker-following-status", id] });
        toast({ title: "Now following", description: "You'll receive updates from this speaker." });
    },
  });

  const unfollow = useMutation({
    mutationFn: (id: string) => speakerService.unfollow(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ["speakers"] });
      await queryClient.invalidateQueries({ queryKey: ["speaker", id] });
      await queryClient.invalidateQueries({ queryKey: ["speaker-following-status", id] });
      toast({ title: "Unfollowed", description: "You will no longer receive updates." });
    },
  });

  const apply = useMutation({
    mutationFn: (payload: SpeakerApplicationPayload) => speakerService.apply(payload),
    onSuccess: () => {
      toast({ title: "Application submitted", description: "Our team will review and get back to you shortly." });
    },
  });

  return { follow, unfollow, apply };
};

