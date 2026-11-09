import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const paymentSchema = new Schema({
  userId: { type: String, required: true, index: true },
  reference: { type: String, required: true, unique: true, index: true },
  amountKobo: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
}, { timestamps: true });

export type Payment = InferSchemaType<typeof paymentSchema>;
export const PaymentModel =
  (mongoose.models.Payment as Model<Payment>) ?? mongoose.model<Payment>("Payment", paymentSchema);
