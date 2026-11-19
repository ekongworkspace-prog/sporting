import { getProfileByRole } from "@/lib/api/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import {
//   deletePlannerEvent,
//   getAllEvents,
//   getPlannerAnalytics,
//   getPlannerEvent,
//   getPlannerEvents,
//   updateEvent,
// } from "@/libs/api/events";
// import { UpdateEventInput } from "@/types/event.types";

export const useGetProfileByRole = (userRole: string) => {
  return useQuery({
    queryKey: ["profiles", userRole],
    queryFn: () => getProfileByRole(userRole),
    enabled: Boolean(userRole),
    retry: false,
  });
};

// export const usePlannerEvents = () => {
//   return useQuery({
//     queryKey: ["planner", "events"],
//     queryFn: getPlannerEvents,
//   });
// };

// export const usePlannerEvent = (eventId: string) => {
//   return useQuery({
//     queryKey: ["planner", "event", eventId],
//     queryFn: () => getPlannerEvent(eventId),
//     enabled: Boolean(eventId),
//   });
// };

// export const useUpdateEvent = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       eventId,
//       data,
//     }: {
//       eventId: string;
//       data: UpdateEventInput;
//     }) => updateEvent(eventId, data),

//     onSuccess: (_event, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["planner", "event", variables.eventId],
//       });

//       queryClient.invalidateQueries({
//         queryKey: ["planner", "events",],
//       });
//        queryClient.invalidateQueries({
//         queryKey: ["tickets", variables.eventId],
//       });
//     },
//   });
// };

// export const usePlannerAnalytics = () => {
//   return useQuery({
//     queryKey: ["planner", "analytics"],
//     queryFn: getPlannerAnalytics,
//   });
// };

// export const useDeleteEvent = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ eventId }: { eventId: string }) =>
//       deletePlannerEvent(eventId),

//     onSuccess: (_event, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["planner", "event", variables.eventId],
//       });

//       queryClient.invalidateQueries({
//         queryKey: ["planner", "events"],
//       });
//     },
//   });
// };
