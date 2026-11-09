import { createHmac, timingSafeEqual } from "node:crypto";
import express, { Router } from "express";
import { asyncHandler } from "../../core/http.js";
import { requireSession } from "../../middleware/auth.js";
import { env } from "../../config/env.js";
import { HttpError } from "../../core/errors.js";
import { PaymentModel } from "./payment.model.js";
import { settleWalletFunding } from "../wallets/wallet.service.js";

export const paymentRoutes = Router();

paymentRoutes.post("/initialize", requireSession, asyncHandler(async (request, response) => {
  const amountKobo = Number(request.body.amountKobo);
  if (!Number.isSafeInteger(amountKobo) || amountKobo <= 0) {
    throw new HttpError(400, "Amount must be a positive integer number of kobo", "INVALID_AMOUNT");
  }
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new HttpError(503, "Paystack is not configured", "PAYSTACK_NOT_CONFIGURED");
  }

  const reference = `wallet-${request.user!.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await PaymentModel.create({ userId: request.user!.id, reference, amountKobo });

  const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountKobo,
      email: request.user!.email ?? `${request.user!.id}@example.com`,
      reference,
      callback_url: env.PAYSTACK_CALLBACK_URL || undefined,
    }),
  });
  const data = await paystackResponse.json() as {
    status: boolean;
    message?: string;
    data?: { authorization_url: string; reference: string };
  };
  if (!paystackResponse.ok || !data.status || !data.data) {
    throw new HttpError(502, data.message ?? "Unable to initialize Paystack payment", "PAYSTACK_ERROR");
  }
  response.json({ authorizationUrl: data.data.authorization_url, reference: data.data.reference });
}));

export const paymentWebhookRoutes = Router();

paymentWebhookRoutes.post("/webhook/paystack", express.raw({ type: "application/json" }), asyncHandler(async (request, response) => {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new HttpError(503, "Paystack is not configured", "PAYSTACK_NOT_CONFIGURED");
  }
  const rawBody = Buffer.isBuffer(request.body) ? request.body : Buffer.from(JSON.stringify(request.body));
  const signature = request.headers["x-paystack-signature"];
  const expected = createHmac("sha512", env.PAYSTACK_SECRET_KEY).update(rawBody).digest("hex");
  if (
    typeof signature !== "string" ||
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    throw new HttpError(401, "Invalid Paystack signature", "INVALID_PAYSTACK_SIGNATURE");
  }

  const event = JSON.parse(rawBody.toString("utf8")) as {
    event: string;
    data: { reference: string; amount: number; status: string };
  };
  if (event.event !== "charge.success" || event.data.status !== "success") {
    response.sendStatus(200);
    return;
  }

  await settleWalletFunding(event.data.reference, event.data.amount);
  response.sendStatus(200);
}));
