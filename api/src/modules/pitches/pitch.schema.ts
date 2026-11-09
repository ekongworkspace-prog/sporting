import { z } from "zod";

export const createPitchSchema = z.object({
  name: z.string().trim().min(2).max(100),
  location: z.string().trim().min(2).max(200),
  hourlyRateKobo: z.number().int().nonnegative(),
}).strict();
