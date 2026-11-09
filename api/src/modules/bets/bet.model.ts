import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const BET_OUTCOMES = ["home", "draw", "away"] as const;
export const BET_STATES = ["open", "accepted", "settled", "cancelled", "refunded"] as const;

const betSchema = new Schema({
  matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true, index: true },
  creatorId: { type: String, required: true, index: true },
  acceptorId: { type: String, index: true },
  creatorOutcome: { type: String, enum: BET_OUTCOMES, required: true },
  acceptorOutcome: { type: String, enum: BET_OUTCOMES },
  stakeKobo: { type: Number, required: true, min: 1 },
  state: { type: String, enum: BET_STATES, default: "open", index: true },
  winningOutcome: { type: String, enum: BET_OUTCOMES },
  platformFeeKobo: { type: Number, min: 0, default: 0 },
  settledAt: Date,
}, { timestamps: true });

betSchema.index({ matchId: 1, creatorId: 1, state: 1 });

export type Bet = InferSchemaType<typeof betSchema>;
export const BetModel =
  (mongoose.models.Bet as Model<Bet>) ??
  mongoose.model<Bet>("Bet", betSchema);
