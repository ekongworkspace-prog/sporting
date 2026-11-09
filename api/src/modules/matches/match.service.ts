import mongoose from "mongoose";
import { HttpError } from "../../core/errors.js";
import { PitchModel } from "../pitches/pitch.model.js";
import { BookingModel } from "./booking.model.js";
import { MATCH_STATES, MatchModel, type Match } from "./match.model.js";
import { ClubModel } from "../clubs/club.model.js";
import { withTransaction } from "../../core/transactions.js";
import { RefereeAssignmentModel } from "./refereeAssignment.model.js";

const allowedTransitions: Record<(typeof MATCH_STATES)[number], readonly string[]> = {
  proposed: ["accepted", "cancelled"],
  accepted: ["scheduled", "cancelled"],
  scheduled: ["live", "cancelled"],
  live: ["awaiting_confirmation", "cancelled"],
  awaiting_confirmation: ["completed", "disputed"],
  completed: [],
  disputed: ["completed", "cancelled"],
  cancelled: [],
};

export function transitionMatchState(current: string, next: string): void {
  if (!allowedTransitions[current as keyof typeof allowedTransitions]?.includes(next)) {
    throw new HttpError(409, `Cannot transition match from ${current} to ${next}`, "INVALID_MATCH_STATE");
  }
}

export async function ensurePitchAvailable(pitchId: string, startAt: Date, endAt: Date, session?: mongoose.ClientSession) {
  if (!mongoose.isValidObjectId(pitchId)) throw new HttpError(400, "Invalid pitch id", "INVALID_PITCH_ID");
  if (!await PitchModel.exists({ _id: pitchId, status: "active" }).session(session ?? null)) {
    throw new HttpError(404, "Pitch not found", "PITCH_NOT_FOUND");
  }
  if (await BookingModel.exists({
    pitchId,
    status: "active",
    startAt: { $lt: endAt },
    endAt: { $gt: startAt },
  }).session(session ?? null)) throw new HttpError(409, "Pitch is already booked for that time", "PITCH_CONFLICT");
}

export async function createMatch(input: {
  type: "friendly" | "bet";
  creatorId: string;
  opponentId: string;
  homeClubId: string;
  awayClubId: string;
  pitchId: string;
  startAt: Date;
  endAt: Date;
  refereeId?: string;
  linesmanIds: string[];
}) {
  return withTransaction(async (session) => {
    await ensurePitchAvailable(input.pitchId, input.startAt, input.endAt, session);
    const [match] = await MatchModel.create([{ ...input, state: "proposed" }], { session });
    await BookingModel.create([{
      pitchId: input.pitchId,
      matchId: match._id,
      startAt: input.startAt,
      endAt: input.endAt,
      status: "active",
    }], { session });
    return match;
  });
}

export async function getTransitionMatch(matchId: string) {
  if (!mongoose.isValidObjectId(matchId)) throw new HttpError(400, "Invalid match id", "INVALID_MATCH_ID");
  const match = await MatchModel.findById(matchId);
  if (!match) throw new HttpError(404, "Match not found", "MATCH_NOT_FOUND");
  return match;
}

export function setMatchState(match: Match & { state: string }, nextState: string, reason?: string) {
  transitionMatchState(match.state, nextState);
  if (nextState === "disputed" && (!reason || reason.trim().length < 3)) {
    throw new HttpError(400, "A dispute reason is required", "DISPUTE_REASON_REQUIRED");
  }
  match.state = nextState as Match["state"];
  if (nextState === "disputed") match.disputeReason = reason;
}

export async function requireMatchTeamMember(match: Match, userId: string, roles: string[]) {
  if (roles.includes("admin")) return;
  const clubs = await ClubModel.find({
    _id: { $in: [match.homeClubId, match.awayClubId] },
  }).lean();
  if (!clubs.some((club) => club.ownerId === userId || club.memberIds.includes(userId))) {
    throw new HttpError(403, "Only a participant club member can manage this match", "FORBIDDEN");
  }
}

export async function requireAcceptedReferee(
  match: Match & { _id: mongoose.Types.ObjectId },
  userId: string,
  roles: string[],
) {
  if (roles.includes("admin")) return;
  const accepted = await RefereeAssignmentModel.exists({
    matchId: match._id,
    refereeId: userId,
    status: "accepted",
  });
  if (!accepted && match.refereeId !== userId) {
    throw new HttpError(403, "Only an accepted match official can submit this result", "FORBIDDEN");
  }
}

export async function cancelMatchBooking(matchId: mongoose.Types.ObjectId) {
  return withTransaction(async (session) => {
    await BookingModel.updateMany(
      { matchId, status: "active" },
      { $set: { status: "cancelled" } },
      { session },
    );
  });
}
