import { z } from "zod";

export const createMatchSchema = z.object({
  type: z.enum(["friendly", "bet"]),
  opponentId: z.string().min(1),
  homeClubId: z.string().min(1),
  awayClubId: z.string().min(1),
  pitchId: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  refereeId: z.string().min(1).optional(),
  linesmanIds: z.array(z.string().min(1)).default([]),
}).strict().refine((value) => new Date(value.endAt) > new Date(value.startAt), {
  message: "endAt must be after startAt",
});

export const matchTransitionSchema = z.object({
  state: z.enum(["accepted", "scheduled", "live", "awaiting_confirmation", "completed", "disputed", "cancelled"]),
  reason: z.string().trim().min(3).max(500).optional(),
}).strict();

export const submitResultSchema = z.object({
  homeGoals: z.number().int().nonnegative(),
  awayGoals: z.number().int().nonnegative(),
}).strict();

export const assignRefereeSchema = z.object({
  refereeId: z.string().min(1),
  role: z.enum(["referee", "linesman"]).default("referee"),
}).strict();

export const assignmentResponseSchema = z.object({
  status: z.enum(["accepted", "declined"]),
}).strict();
