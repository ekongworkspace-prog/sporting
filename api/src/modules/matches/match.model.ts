import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const MATCH_STATES = [
  "proposed", "accepted", "scheduled", "live", "awaiting_confirmation",
  "completed", "disputed", "cancelled",
] as const;

const resultSchema = new Schema({
  homeGoals: { type: Number, required: true, min: 0 },
  awayGoals: { type: Number, required: true, min: 0 },
  submittedBy: { type: String, required: true },
}, { _id: false });

const matchSchema = new Schema({
  type: { type: String, enum: ["friendly", "bet", "tournament"], required: true },
  creatorId: { type: String, required: true, index: true },
  opponentId: { type: String, required: true, index: true },
  homeClubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
  awayClubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
  pitchId: { type: Schema.Types.ObjectId, ref: "Pitch", required: true },
  startAt: { type: Date, required: true, index: true },
  endAt: { type: Date, required: true },
  refereeId: { type: String },
  linesmanIds: [{ type: String }],
  state: { type: String, enum: MATCH_STATES, default: "proposed", index: true },
  result: resultSchema,
  confirmations: [{ type: String }],
  disputeReason: String,
  tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament" },
  tournamentStageId: { type: Schema.Types.ObjectId, ref: "TournamentStage" },
}, { timestamps: true });

matchSchema.index({ pitchId: 1, startAt: 1, endAt: 1 });

export type Match = InferSchemaType<typeof matchSchema>;
export const MatchModel = (mongoose.models.Match as Model<Match>) ?? mongoose.model<Match>("Match", matchSchema);
