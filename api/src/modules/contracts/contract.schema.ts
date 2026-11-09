import { z } from "zod";

export const createContractSchema = z.object({
  playerId: z.string().min(1),
  clubId: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).strict().refine((value) => value.endDate > value.startDate, { message: "End date must be after start date" });

export const endContractSchema = z.object({
  reason: z.string().trim().min(1).max(200).optional(),
}).strict();
