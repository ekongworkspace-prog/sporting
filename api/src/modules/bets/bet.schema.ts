import { z } from "zod";

export const createBetSchema = z.object({
  matchId: z.string().min(1),
  creatorOutcome: z.enum(["home", "draw", "away"]),
  stakeKobo: z.number().int().positive(),
}).strict();

export const acceptBetSchema = z.object({
  acceptorOutcome: z.enum(["home", "draw", "away"]),
}).strict();

export const settleBetSchema = z.object({
  winningOutcome: z.enum(["home", "draw", "away"]),
}).strict();
