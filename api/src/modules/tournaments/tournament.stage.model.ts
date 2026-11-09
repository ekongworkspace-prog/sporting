import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const generatedFixtureSchema = new Schema({
  round: { type: Number, required: true },
  leg: { type: Number, enum: [1, 2], required: true },
  homeTeamId: { type: Schema.Types.ObjectId, ref: "Club", required: false },
  awayTeamId: { type: Schema.Types.ObjectId, ref: "Club", required: false },
  matchId: { type: Schema.Types.ObjectId, ref: "Match" },
  homeTeamPlaceholder: String,
  awayTeamPlaceholder: String,
  group: Number,
}, { _id: false });

const tournamentStageSchema = new Schema({
  tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true, index: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["group", "knockout"], required: true },
  order: { type: Number, required: true },
  fixtures: [generatedFixtureSchema],
}, { timestamps: true });

tournamentStageSchema.index({ tournamentId: 1, order: 1 }, { unique: true });

export type TournamentStage = InferSchemaType<typeof tournamentStageSchema>;
export const TournamentStageModel =
  (mongoose.models.TournamentStage as Model<TournamentStage>) ??
  mongoose.model<TournamentStage>("TournamentStage", tournamentStageSchema);
