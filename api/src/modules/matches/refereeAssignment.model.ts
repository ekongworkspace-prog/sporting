import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const refereeAssignmentSchema = new Schema({
  matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true, index: true },
  refereeId: { type: String, required: true, index: true },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  role: { type: String, enum: ["referee", "linesman"], default: "referee" },
}, { timestamps: true });

refereeAssignmentSchema.index({ matchId: 1, refereeId: 1, role: 1 }, { unique: true });

export type RefereeAssignment = InferSchemaType<typeof refereeAssignmentSchema>;
export const RefereeAssignmentModel =
  (mongoose.models.RefereeAssignment as Model<RefereeAssignment>) ??
  mongoose.model<RefereeAssignment>("RefereeAssignment", refereeAssignmentSchema);
