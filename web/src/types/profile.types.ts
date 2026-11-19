export type ProfileRole = "player" | "coach" | "owner" | "referee";

export interface CloudinaryImage {
  url: string;
  publicId: string;
}

export interface Profile {
  email?: string;
  fullName?: string;
  country?: string;
  age?: number;
  nin?: string;
  state?: string;
  localGovernment?: string;
  address?: string;
  credentialType?: string;
  credentialNumber?: string;
  position?: string;
  strongFoot?: string;
  heightCm?: number;
  teamsCoached?: string[];
  licenseNumber?: string;
  clubName?: string;
  clubLocation?: string;
  clubImages?: CloudinaryImage[];
  invitedPlayerEmails?: string[];
  profilePicture?: CloudinaryImage;
  club?: string;
  transferStatus?: string;
  goals?: number;
  assists?: number;
  tournaments?: number;
  starRating?: number;
  marketValue?: number;
  weakFoot?: number;
  strength?: number;
  stamina?: number;
  contractLength?: number;
}



