import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(1).max(2000),
  priceKobo: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
}).strict();

export const purchaseProductSchema = z.object({
  quantity: z.number().int().positive().max(100),
  idempotencyKey: z.string().trim().min(1).max(150),
}).strict();
