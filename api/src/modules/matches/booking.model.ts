import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const bookingSchema = new Schema({
  pitchId: { type: Schema.Types.ObjectId, ref: "Pitch", required: true, index: true },
  matchId: { type: Schema.Types.ObjectId, ref: "Match" },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  status: { type: String, enum: ["active", "cancelled"], default: "active", index: true },
}, { timestamps: true });

bookingSchema.index({ pitchId: 1, startAt: 1, endAt: 1 });

export type Booking = InferSchemaType<typeof bookingSchema>;
export const BookingModel =
  (mongoose.models.Booking as Model<Booking>) ?? mongoose.model<Booking>("Booking", bookingSchema);
