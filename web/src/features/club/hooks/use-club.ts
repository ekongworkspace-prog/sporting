import { useMutation } from "@tanstack/react-query";
import { sendClubInvitations } from "@/lib/api/club";
import type { ClubInvitation } from "@/types/club.types";

export const useClubInvitations = () =>
  useMutation({
    mutationFn: (invitation: ClubInvitation) => sendClubInvitations(invitation),
  });
