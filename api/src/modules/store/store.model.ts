import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  priceKobo: { type: Number, required: true, min: 1 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sellerId: { type: String, required: true, index: true },
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true });

const orderSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "StoreProduct", required: true, index: true },
  buyerId: { type: String, required: true, index: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPriceKobo: { type: Number, required: true, min: 1 },
  totalKobo: { type: Number, required: true, min: 1 },
  state: { type: String, enum: ["paid", "cancelled"], default: "paid" },
  idempotencyKey: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

export type StoreProduct = InferSchemaType<typeof productSchema>;
export type StoreOrder = InferSchemaType<typeof orderSchema>;
export const StoreProductModel =
  (mongoose.models.StoreProduct as Model<StoreProduct>) ??
  mongoose.model<StoreProduct>("StoreProduct", productSchema);
export const StoreOrderModel =
  (mongoose.models.StoreOrder as Model<StoreOrder>) ??
  mongoose.model<StoreOrder>("StoreOrder", orderSchema);
