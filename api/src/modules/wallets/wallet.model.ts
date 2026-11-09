import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const walletSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  currency: { type: String, enum: ["NGN"], required: true, default: "NGN" },
  balanceKobo: { type: Number, required: true, min: 0, default: 0 },
}, { timestamps: true });

const ledgerEntrySchema = new Schema({
  walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true, index: true },
  direction: { type: String, enum: ["credit", "debit"], required: true },
  amountKobo: { type: Number, required: true, min: 1 },
  reason: { type: String, required: true, trim: true },
  reference: { type: String, required: true, index: true },
  idempotencyKey: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

ledgerEntrySchema.pre(["updateOne", "updateMany", "replaceOne", "findOneAndUpdate"], function () {
  throw new mongoose.Error("Ledger entries are immutable");
});

export type Wallet = InferSchemaType<typeof walletSchema>;
export type LedgerEntry = InferSchemaType<typeof ledgerEntrySchema>;

export const WalletModel = (mongoose.models.Wallet as Model<Wallet>) ?? mongoose.model<Wallet>("Wallet", walletSchema);
export const LedgerEntryModel =
  (mongoose.models.LedgerEntry as Model<LedgerEntry>) ?? mongoose.model<LedgerEntry>("LedgerEntry", ledgerEntrySchema);
