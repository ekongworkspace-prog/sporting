export interface ClubInvitation {
  clubName: string;
  ownerName: string;
  emails: string[];
}

export interface ClubInvitationResponse {
  invited: number;
}