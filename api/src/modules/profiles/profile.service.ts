import { HttpError } from "../../core/errors.js";
import {
  CoachProfileModel,
  OwnerProfileModel,
  PlayerProfileModel,
  RefereeProfileModel,
} from "./profile.model.js";

export type ProfileType = "player" | "coach" | "referee" | "owner";

const editableFields: Record<ProfileType, Set<string>> = {
  player: new Set(["email", "fullName", "country", "age", "nin", "profilePicture", "state", "localGovernment", "address", "credentialType", "credentialNumber", "position", "strongFoot", "heightCm"]),
  coach: new Set(["email", "fullName", "country", "age", "nin", "profilePicture", "state", "localGovernment", "address", "credentialType", "credentialNumber", "teamsCoached"]),
  referee: new Set(["email", "fullName", "country", "age", "nin", "profilePicture", "state", "localGovernment", "address", "credentialType", "credentialNumber", "licenseNumber"]),
  owner: new Set(["email", "fullName", "country", "age", "nin", "profilePicture", "state", "localGovernment", "address", "credentialType", "credentialNumber", "clubName", "clubLocation", "clubImages", "invitedPlayerEmails"]),
};

export function maskNin(nin?: string | null): string {
  return nin ? `****${nin.slice(-4)}` : "";
}

export function allowedPatch(type: ProfileType, data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([key]) => editableFields[type].has(key)));
}

export async function getProfile(type: ProfileType, userId: string) {
  let profile;
  const playerRole = type.toLowerCase() ;
  if (playerRole === "player") profile = await PlayerProfileModel.findOne({ userId }).lean();
  if (playerRole === "coach") profile = await CoachProfileModel.findOne({ userId }).lean();
  if (playerRole === "referee") profile = await RefereeProfileModel.findOne({ userId }).lean();
  if (playerRole === "owner") profile = await OwnerProfileModel.findOne({ userId }).lean();
  if (!profile) return null;
  return { ...profile, nin: maskNin(profile.nin) };
}

export async function upsertProfile(type: ProfileType, userId: string, data: Record<string, unknown>) {
  const patch = allowedPatch(type, data);
  try {
    let profile;
    const update = { $set: { ...patch, userId } };
    const options = { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true };
    if (type === "player") profile = await PlayerProfileModel.findOneAndUpdate({ userId }, update, options).lean();
    if (type === "coach") profile = await CoachProfileModel.findOneAndUpdate({ userId }, update, options).lean();
    if (type === "referee") profile = await RefereeProfileModel.findOneAndUpdate({ userId }, update, options).lean();
    if (type === "owner") profile = await OwnerProfileModel.findOneAndUpdate({ userId }, update, options).lean();
    return { ...profile, nin: maskNin(profile?.nin) };
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      throw new HttpError(409, "NIN is already registered to another profile", "NIN_EXISTS");
    }
    throw error;
  }
}
