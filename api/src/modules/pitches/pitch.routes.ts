import { Router } from "express";
import { asyncHandler } from "../../core/http.js";
import { requireSession } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/roleGuard.js";
import { validate } from "../../middleware/validate.js";
import { PitchModel } from "./pitch.model.js";
import { createPitchSchema } from "./pitch.schema.js";

export const pitchRoutes = Router();

pitchRoutes.get("/", asyncHandler(async (_request, response) => {
  response.json({ pitches: await PitchModel.find({ status: "active" }).sort({ name: 1 }).lean() });
}));

pitchRoutes.post("/", requireSession, requireRole("venue_manager", "admin"), validate(createPitchSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as {
      name: string;
      location: string;
      hourlyRateKobo: number;
    };
    const pitch = await PitchModel.create({
      ...data,
      venueManagerId: request.user!.id,
    });
    response.status(201).json({ pitch });
  }));
