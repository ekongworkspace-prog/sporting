import type { ClubInvitation, ClubInvitationResponse } from "@/types/club.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendClubInvitations = async ({
  clubName,
  ownerName,
  emails,
}: ClubInvitation): Promise<ClubInvitationResponse> => {
  const response = await fetch(`${API_URL}/api/profiles/club-invitations`, {
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

