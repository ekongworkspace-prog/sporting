import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const TOURNAMENT_STATES = ["draft", "open", "cancelled", "completed"] as const;

const tournamentSchema = new Schema({
  title: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  duration: { type: Number, required: true, min: 1 },
  teamCount: { type: Number, required: true, min: 2 },
  award: { type: Number, required: true, min: 0 },
  sponsors: [{ type: String, trim: true }],
  format: { type: String, enum: ["league", "knockout", "groups_knockout"], required: true },
  legs: { type: Number, enum: [1, 2], default: 1 },
  entryFeeKobo: { type: Number, required: true, min: 0 },
  registrationClosesAt: { type: Date, required: true },
  registeredTeamIds: [{ type: Schema.Types.ObjectId, ref: "Club" }],
  creatorId: { type: String, required: true, index: true },
  state: { type: String, enum: TOURNAMENT_STATES, default: "draft", index: true },
}, { timestamps: true });

tournamentSchema.index({ creatorId: 1, title: 1 });

export type Tournament = InferSchemaType<typeof tournamentSchema>;
export const TournamentModel =
  (mongoose.models.Tournament as Model<Tournament>) ??
  mongoose.model<Tournament>("Tournament", tournamentSchema);
