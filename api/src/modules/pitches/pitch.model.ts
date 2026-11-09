import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const pitchSchema = new Schema({
  name: { type: String, required: true, trim: true },
  venueManagerId: { type: String, required: true, index: true },
  location: { type: String, required: true, trim: true },
  hourlyRateKobo: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

export type Pitch = InferSchemaType<typeof pitchSchema>;
export const PitchModel = (mongoose.models.Pitch as Model<Pitch>) ?? mongoose.model<Pitch>("Pitch", pitchSchema);
