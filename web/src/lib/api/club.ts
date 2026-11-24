import type { ClubInvitation, ClubInvitationResponse } from "@/types/club.types";

export const sendClubInvitations = async ({
  clubName,
  ownerName,
  emails,
}: ClubInvitation): Promise<ClubInvitationResponse> => {
  const response = await fetch("/api/profiles/club-invitations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ clubName, ownerName, emails }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Failed to send club invitations");
  }

  return result;
};

