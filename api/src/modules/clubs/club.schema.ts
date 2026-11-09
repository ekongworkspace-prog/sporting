import { z } from "zod";

export const createClubSchema = z.object({
  name: z.string().trim().min(2).max(100),
}).strict();
