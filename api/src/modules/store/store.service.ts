import mongoose, { type ClientSession } from "mongoose";
import { HttpError } from "../../core/errors.js";
import { withTransaction } from "../../core/transactions.js";
import { LedgerEntryModel, WalletModel } from "../wallets/wallet.model.js";
import { StoreOrderModel, StoreProductModel } from "./store.model.js";

export async function purchaseProduct(input: {
  productId: string;
  buyerId: string;
  quantity: number;
  idempotencyKey: string;
}) {
  if (!Number.isSafeInteger(input.quantity) || input.quantity <= 0) {
    throw new HttpError(400, "Quantity must be a positive integer", "INVALID_QUANTITY");
  }
  if (!mongoose.isValidObjectId(input.productId)) {
    throw new HttpError(400, "Invalid product id", "INVALID_PRODUCT_ID");
  }
  return withTransaction(async (session) => {
    const duplicate = await StoreOrderModel.findOne({ idempotencyKey: input.idempotencyKey }).session(session);
    if (duplicate) return duplicate;

    const product = await StoreProductModel.findOne({
      _id: input.productId,
      active: true,
    }).session(session);
    if (!product) throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
    if (product.stock < input.quantity) {
      throw new HttpError(409, "Insufficient stock", "INSUFFICIENT_STOCK");
    }
    const totalKobo = product.priceKobo * input.quantity;
    if (!Number.isSafeInteger(totalKobo)) throw new HttpError(400, "Invalid purchase amount", "INVALID_AMOUNT");

    const wallet = await WalletModel.findOne({ userId: input.buyerId }).session(session);
    if (!wallet || wallet.balanceKobo < totalKobo) {
      throw new HttpError(409, "Insufficient wallet balance", "INSUFFICIENT_BALANCE");
    }
    const ledgerDuplicate = await LedgerEntryModel.exists({
      idempotencyKey: `store:${input.idempotencyKey}`,
    }).session(session);
    if (ledgerDuplicate) throw new HttpError(409, "Purchase already recorded", "DUPLICATE_PURCHASE");

    product.stock -= input.quantity;
    await product.save({ session });
    wallet.balanceKobo -= totalKobo;
    await wallet.save({ session });
    await LedgerEntryModel.create([{
      walletId: wallet._id,
      direction: "debit",
      amountKobo: totalKobo,
      reason: "store purchase",
      reference: product._id.toString(),
      idempotencyKey: `store:${input.idempotencyKey}`,
    }], { session });
    const [order] = await StoreOrderModel.create([{
      productId: product._id,
      buyerId: input.buyerId,
      quantity: input.quantity,
      unitPriceKobo: product.priceKobo,
      totalKobo,
      state: "paid",
      idempotencyKey: input.idempotencyKey,
    }], { session });
    return order;
  });
}

export async function updateProductStock(productId: string, stock: number, sellerId: string, session?: ClientSession) {
  const product = await StoreProductModel.findOne({ _id: productId, sellerId }).session(session ?? null);
  if (!product) throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
  if (!Number.isSafeInteger(stock) || stock < 0) {
    throw new HttpError(400, "Stock must be a non-negative integer", "INVALID_STOCK");
  }
  product.stock = stock;
  await product.save({ session });
  return product;
}
