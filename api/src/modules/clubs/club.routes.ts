import { Router } from "express";
import { asyncHandler } from "../../core/http.js";
import { requireSession } from "../../middleware/auth.js";
import { HttpError } from "../../core/errors.js";
import { ClubModel } from "./club.model.js";
import { createClubSchema } from "./club.schema.js";
import { requireRole } from "../../middleware/roleGuard.js";

export const clubRoutes = Router();

clubRoutes.get("/", asyncHandler(async (_request, response) => {
  response.json({ clubs: await ClubModel.find().sort({ name: 1 }).lean() });
}));

clubRoutes.post("/", requireSession, requireRole("coach", "admin"), asyncHandler(async (request, response) => {
  const result = createClubSchema.safeParse(request.body);
  if (!result.success) throw new HttpError(400, "Invalid request", "VALIDATION_ERROR");
  const club = await ClubModel.create({
    ...result.data,
    ownerId: request.user!.id,
    memberIds: [request.user!.id],
  });
  response.status(201).json({ club });
}));
