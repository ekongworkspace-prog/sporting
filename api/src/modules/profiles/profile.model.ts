import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const profilePictureSchema = {
  url: { type: String, trim: true, default: "" },
  publicId: { type: String, trim: true, default: "" },
};

const baseFields = {
  userId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  fullName: { type: String, required: true, trim: true },
  country: { type: String, trim: true, default: "" },
  age: { type: Number, min: 0 },
  nin: { type: String, required: true, unique: true, trim: true },
  state: { type: String, trim: true, default: "" },
  localGovernment: { type: String, trim: true, default: "" },
  address: { type: String, trim: true, default: "" },
  credentialType: { type: String, enum: ["nin", "passport", "driver_license", "voters_card"], default: "nin" },
  credentialNumber: { type: String, trim: true, default: "" },
  profilePicture: { type: profilePictureSchema, default: () => ({ url: "", publicId: "" }) },
};

const playerSchema = new Schema({
  ...baseFields,
  club: { type: String, default: "" },
  transferStatus: { type: String, enum: ["available", "contracted", "retired"], default: "contracted" },
  goals: { type: Number, min: 0, default: 0 },
  assists: { type: Number, min: 0, default: 0 },
  tournaments: { type: Number, min: 0, default: 0 },
  starRating: { type: Number, min: 0, max: 5, default: 0 },
  marketValue: { type: Number, min: 0, default: 0 },
  weakFoot: { type: Number, min: 1, max: 5 },
  strongFoot: { type: String, enum: ["left", "right", "both"], default: "right" },
  strength: { type: Number, min: 1, max: 100 },
  stamina: { type: Number, min: 1, max: 100 },
  contractLength: { type: Number, min: 0, default: 0 },
  position: { type: String, enum: ["goalkeeper", "defender", "midfielder", "forward"] },
  heightCm: { type: Number, min: 100, max: 230 },
}, { timestamps: true });

const coachSchema = new Schema({
  ...baseFields,
  currentClub: { type: String, default: "" },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  competitionsWon: { type: Number, min: 0, default: 0 },
  teamsCoached: [{ type: String, trim: true }],
}, { timestamps: true });

const refereeSchema = new Schema({
  ...baseFields,
  licenseNumber: { type: String, trim: true, default: "" },
  rating: { type: Number, min: 0, max: 5, default: 0 },
}, { timestamps: true });

export type PlayerProfile = InferSchemaType<typeof playerSchema>;
export type CoachProfile = InferSchemaType<typeof coachSchema>;
export type RefereeProfile = InferSchemaType<typeof refereeSchema>;

export const PlayerProfileModel =
  (mongoose.models.PlayerProfile as Model<PlayerProfile>) ?? mongoose.model<PlayerProfile>("PlayerProfile", playerSchema);
export const CoachProfileModel =
  (mongoose.models.CoachProfile as Model<CoachProfile>) ?? mongoose.model<CoachProfile>("CoachProfile", coachSchema);
export const RefereeProfileModel =
  (mongoose.models.RefereeProfile as Model<RefereeProfile>) ?? mongoose.model<RefereeProfile>("RefereeProfile", refereeSchema);

const ownerSchema = new Schema({
  ...baseFields,
  clubName: { type: String, trim: true, default: "" },
  clubLocation: { type: String, trim: true, default: "" },
  clubImages: [{
    url: { type: String, trim: true, required: true },
    publicId: { type: String, trim: true, required: true },
  }],
  invitedPlayerEmails: [{ type: String, trim: true, lowercase: true }],
}, { timestamps: true });

export type OwnerProfile = InferSchemaType<typeof ownerSchema>;
export const OwnerProfileModel =
  (mongoose.models.OwnerProfile as Model<OwnerProfile>) ?? mongoose.model<OwnerProfile>("OwnerProfile", ownerSchema);
