import { HttpError } from "../../core/errors.js";
import { withTransaction } from "../../core/transactions.js";
import { LedgerEntryModel, WalletModel } from "./wallet.model.js";
import { PaymentModel } from "../payments/payment.model.js";

export async function getOrCreateWallet(userId: string) {
  const wallet = await WalletModel.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, currency: "NGN", balanceKobo: 0 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();
  return wallet;
}

export async function creditWallet(input: {
  userId: string;
  amountKobo: number;
  reason: string;
  reference: string;
  idempotencyKey: string;
}) {
  if (!Number.isSafeInteger(input.amountKobo) || input.amountKobo <= 0) {
    throw new HttpError(400, "Amount must be a positive integer number of kobo", "INVALID_AMOUNT");
  }

  return withTransaction(async (session) => {
    const wallet = await WalletModel.findOneAndUpdate(
      { userId: input.userId },
      { $setOnInsert: { userId: input.userId, currency: "NGN", balanceKobo: 0 } },
      { new: true, upsert: true, setDefaultsOnInsert: true, session },
    );

    const duplicate = await LedgerEntryModel.findOne({ idempotencyKey: input.idempotencyKey }).session(session).lean();
    if (duplicate) return wallet;

    wallet.balanceKobo += input.amountKobo;
    await wallet.save({ session });
    await LedgerEntryModel.create([{
      walletId: wallet._id,
      direction: "credit",
      amountKobo: input.amountKobo,
      reason: input.reason,
      reference: input.reference,
      idempotencyKey: input.idempotencyKey,
    }], { session });
    return wallet;
  });
}

export async function debitWallet(input: {
  userId: string;
  amountKobo: number;
  reason: string;
  reference: string;
  idempotencyKey: string;
}) {
  if (!Number.isSafeInteger(input.amountKobo) || input.amountKobo <= 0) {
    throw new HttpError(400, "Amount must be a positive integer number of kobo", "INVALID_AMOUNT");
  }

  return withTransaction(async (session) => {
    const wallet = await WalletModel.findOne({ userId: input.userId }).session(session);
    if (!wallet || wallet.balanceKobo < input.amountKobo) {
      throw new HttpError(409, "Insufficient wallet balance", "INSUFFICIENT_BALANCE");
    }
    const duplicate = await LedgerEntryModel.findOne({ idempotencyKey: input.idempotencyKey }).session(session).lean();
    if (duplicate) return wallet;

    wallet.balanceKobo -= input.amountKobo;
    await wallet.save({ session });
    await LedgerEntryModel.create([{
      walletId: wallet._id,
      direction: "debit",
      amountKobo: input.amountKobo,
      reason: input.reason,
      reference: input.reference,
      idempotencyKey: input.idempotencyKey,
    }], { session });
    return wallet;
  });
}

export async function getLedgerEntries(userId: string) {
  const wallet = await getOrCreateWallet(userId);
  return LedgerEntryModel.find({ walletId: wallet._id }).sort({ createdAt: -1 }).lean();
}

export async function settleWalletFunding(reference: string, webhookAmountKobo: number) {
  return withTransaction(async (session) => {
    const payment = await PaymentModel.findOne({ reference }).session(session);
    if (!payment) return null;
    if (payment.status === "successful") return payment;
    if (!Number.isSafeInteger(webhookAmountKobo) || payment.amountKobo !== webhookAmountKobo) {
      throw new HttpError(409, "Paystack amount does not match payment", "PAYSTACK_AMOUNT_MISMATCH");
    }

    const wallet = await WalletModel.findOneAndUpdate(
      { userId: payment.userId },
      { $setOnInsert: { userId: payment.userId, currency: "NGN", balanceKobo: 0 } },
      { new: true, upsert: true, setDefaultsOnInsert: true, session },
    );
    const idempotencyKey = `paystack:${payment.reference}`;
    const duplicate = await LedgerEntryModel.findOne({ idempotencyKey }).session(session).lean();
    if (!duplicate) {
      wallet.balanceKobo += payment.amountKobo;
      await wallet.save({ session });
      await LedgerEntryModel.create([{
        walletId: wallet._id,
        direction: "credit",
        amountKobo: payment.amountKobo,
        reason: "wallet funding",
        reference: payment.reference,
        idempotencyKey,
      }], { session });
    }

    payment.status = "successful";
    await payment.save({ session });
    return wallet;
  });
}
