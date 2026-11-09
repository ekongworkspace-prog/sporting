import { z } from "zod";

export const profileTypeSchema = z.enum(["player", "coach", "referee", "owner"]);

const editableIdentitySchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  country: z.string().trim().max(80).optional(),
  age: z.number().int().min(0).max(120).optional(),
  state: z.string().trim().max(80).optional(),
  localGovernment: z.string().trim().max(80).optional(),
  address: z.string().trim().max(200).optional(),
  credentialType: z.enum(["nin", "passport", "driver_license", "voters_card"]).optional(),
  credentialNumber: z.string().trim().min(1).max(100).optional(),
  profilePicture: z.object({
    url: z.string().url(),
    publicId: z.string().min(1),
  }).optional(),
});

export const playerCreateSchema = editableIdentitySchema.extend({
  position: z.enum(["goalkeeper", "defender", "midfielder", "forward"]).optional(),
  strongFoot: z.enum(["left", "right", "both"]).optional(),
  heightCm: z.number().int().min(100).max(230).optional(),
}).strict();

export const coachCreateSchema = editableIdentitySchema.extend({
  teamsCoached: z.array(z.string().trim().min(1)).optional(),
}).strict();

export const refereeCreateSchema = editableIdentitySchema.extend({
  licenseNumber: z.string().trim().max(100).optional(),
}).strict();

export const ownerCreateSchema = editableIdentitySchema.extend({
  clubName: z.string().trim().min(2).max(100).optional(),
  clubLocation: z.string().trim().max(200).optional(),
  clubImages: z.array(z.object({
    url: z.string().url(),
    publicId: z.string().min(1),
  })).optional(),
  invitedPlayerEmails: z.array(z.string().email()).optional(),
}).strict();
