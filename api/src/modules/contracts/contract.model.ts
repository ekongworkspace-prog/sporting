import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const contractSchema = new Schema({
  playerId: { type: String, required: true, index: true },
  clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "pending", "ended", "cancelled"], default: "pending" },
}, { timestamps: true });

export type Contract = InferSchemaType<typeof contractSchema>;
export const ContractModel =
  (mongoose.models.Contract as Model<Contract>) ?? mongoose.model<Contract>("Contract", contractSchema);
