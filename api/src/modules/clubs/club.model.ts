import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const clubSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  ownerId: { type: String, required: true, index: true },
  memberIds: [{ type: String }],
  walletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
}, { timestamps: true });

export type Club = InferSchemaType<typeof clubSchema>;
export const ClubModel = (mongoose.models.Club as Model<Club>) ?? mongoose.model<Club>("Club", clubSchema);
