import { Router } from "express";
import { asyncHandler } from "../../core/http.js";
import { requireSession } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/roleGuard.js";
import { validate } from "../../middleware/validate.js";
import { StoreOrderModel, StoreProductModel } from "./store.model.js";
import { createProductSchema, purchaseProductSchema } from "./store.schema.js";
import { purchaseProduct } from "./store.service.js";

export const storeRoutes = Router();

storeRoutes.get("/products", asyncHandler(async (_request, response) => {
  response.json({ products: await StoreProductModel.find({ active: true }).sort({ createdAt: -1 }).lean() });
}));

storeRoutes.post("/products", requireSession, requireRole("admin"), validate(createProductSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as {
      name: string;
      description: string;
      priceKobo: number;
      stock: number;
    };
    const product = await StoreProductModel.create({ ...data, sellerId: request.user!.id });
    response.status(201).json({ product });
  }));

storeRoutes.post("/products/:id/purchases", requireSession, validate(purchaseProductSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as { quantity: number; idempotencyKey: string };
    const order = await purchaseProduct({
      productId: String(request.params.id),
      buyerId: request.user!.id,
      quantity: data.quantity,
      idempotencyKey: data.idempotencyKey,
    });
    response.status(201).json({ order });
  }));

storeRoutes.get("/orders/me", requireSession, asyncHandler(async (request, response) => {
  response.json({
    orders: await StoreOrderModel.find({ buyerId: request.user!.id }).sort({ createdAt: -1 }).lean(),
  });
}));
