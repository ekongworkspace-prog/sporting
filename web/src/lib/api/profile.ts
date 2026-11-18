import { Profile } from "@/types/profile.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProfileByRole = async (
  userRole: string
): Promise<Profile> => {
  const response = await fetch(
    `${API_URL}/api/profiles/${userRole}/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load profile");
  }

  return result;
};

// export const getAllEvents = async (): Promise<EventType[]> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
//     {
//       method: "GET",
//       credentials: "include",
//       cache: "no-store",
//     },
//   );

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || "Failed to fetch events");
//   }

//   return result.data;
// };

// export const getPlannerEvents = async (): Promise<EventType[]> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/events/planner`,
//     {
//       credentials: "include",
//     },
//   );

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || "Failed to fetch planner events");
//   }

//   return result.events;
// };

// export const getPlannerEvent = async (eventId: string): Promise<EventType> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/events/planner/event/${eventId}`,
//     {
//       credentials: "include",
//     },
//   );

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || "Failed to fetch event");
//   }

//   return result.event;
// };

// export const updateEvent = async (
//   eventId: string,
//   data: UpdateEventInput,
// ): Promise<Event> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/events/planner/event/${eventId}`,
//     {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//       body: JSON.stringify(data),
//     },
//   );

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || "Failed to update event");
//   }

//   return result.event;
// };

// export const getPlannerAnalytics = async (): Promise<PlannerAnalytics> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/events/planner/analytics`,
//     {
//       credentials: "include",
//     },
//   );

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || "Failed to fetch planner analytics");
//   }

//   return result.analytics;
// };

// export const deletePlannerEvent = async (
//   eventId: string,
// ): Promise<{ success: boolean }> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/events/planner/event/${eventId}`,

//     {
//       method: "DELETE",
//       credentials: "include",
//     },
//   );

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || "Failed to delete event");
//   }

//   return result;
// };
