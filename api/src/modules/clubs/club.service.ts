import mongoose from "mongoose";
import { HttpError } from "../../core/errors.js";
import { ClubModel } from "./club.model.js";

export async function requireClubOwner(clubId: string, userId: string, roles: string[] = []) {
  if (!mongoose.isValidObjectId(clubId)) {
    throw new HttpError(400, "Invalid club id", "INVALID_CLUB_ID");
  }

  const club = await ClubModel.findById(clubId).lean();
  if (!club) throw new HttpError(404, "Club not found", "CLUB_NOT_FOUND");
  if (!roles.includes("admin") && club.ownerId !== userId) {
    throw new HttpError(403, "Only the club owner can manage contracts", "FORBIDDEN");
  }
  return club;
}
