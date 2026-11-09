import { z } from "zod";

export const createTournamentSchema = z.object({
  title: z.string().trim().min(2).max(150),
  year: z.number().int().min(2000).max(2100),
  duration: z.number().int().positive(),
  teamCount: z.number().int().min(2),
  award: z.number().int().nonnegative(),
  sponsors: z.array(z.string().trim().min(1)).default([]),
  format: z.enum(["league", "knockout", "groups_knockout"]),
  legs: z.union([
    z.literal(1),
    z.literal(2),
    z.literal("1").transform(() => 1),
    z.literal("2").transform(() => 2),
  ]).default(1),
  entryFeeKobo: z.number().int().nonnegative(),
  registrationClosesAt: z.string().datetime(),
}).strict();

export const tournamentRegistrationSchema = z.object({
  clubId: z.string().min(1),
}).strict();

export const generateFixturesSchema = z.object({
  groupCount: z.number().int().min(1).optional(),
}).strict().default({});
