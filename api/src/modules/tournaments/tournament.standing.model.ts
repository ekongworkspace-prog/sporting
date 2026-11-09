import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const standingSchema = new Schema({
  tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true, index: true },
  stageId: { type: Schema.Types.ObjectId, ref: "TournamentStage", required: true, index: true },
  teamId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
  played: { type: Number, default: 0 },
  won: { type: Number, default: 0 },
  drawn: { type: Number, default: 0 },
  lost: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  goalDifference: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
}, { timestamps: true });

standingSchema.index({ tournamentId: 1, stageId: 1, teamId: 1 }, { unique: true });

export type Standing = InferSchemaType<typeof standingSchema>;
export const StandingModel =
  (mongoose.models.Standing as Model<Standing>) ??
  mongoose.model<Standing>("Standing", standingSchema);
