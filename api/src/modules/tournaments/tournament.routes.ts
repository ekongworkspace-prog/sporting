import { Router } from "express";
import { asyncHandler } from "../../core/http.js";
import { HttpError } from "../../core/errors.js";
import { requireSession } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/roleGuard.js";
import { validate } from "../../middleware/validate.js";
import { TournamentModel } from "./tournament.model.js";
import { createTournamentSchema, generateFixturesSchema, tournamentRegistrationSchema } from "./tournament.schema.js";
import { cancelTournamentRegistration, registerClubForTournament } from "./tournament.service.js";
import { generateAndPersistFixtures } from "./tournament.service.js";
import { StandingModel } from "./tournament.standing.model.js";

export const tournamentRoutes = Router();

tournamentRoutes.get("/", asyncHandler(async (_request, response) => {
  response.json({ tournaments: await TournamentModel.find().sort({ year: -1, title: 1 }).lean() });
}));

tournamentRoutes.post("/", requireSession, requireRole("admin", "coach"), validate(createTournamentSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as {
      title: string;
      year: number;
      duration: number;
      teamCount: number;
      award: number;
      sponsors: string[];
      format: "league" | "knockout" | "groups_knockout";
      legs: 1 | 2;
      entryFeeKobo: number;
      registrationClosesAt: string;
    };
    const tournament = await TournamentModel.create({
      ...data,
      registrationClosesAt: new Date(data.registrationClosesAt),
      creatorId: request.user!.id,
      state: "draft",
      registeredTeamIds: [],
    });
    response.status(201).json({ tournament });
  }));

tournamentRoutes.post("/:id/open", requireSession, requireRole("admin", "coach"),
  asyncHandler(async (request, response) => {
    const tournament = await TournamentModel.findById(String(request.params.id));
    if (!tournament) throw new HttpError(404, "Tournament not found", "TOURNAMENT_NOT_FOUND");
    if (!request.user!.roles?.includes("admin") && tournament.creatorId !== request.user!.id) {
      throw new HttpError(403, "Only the tournament creator can open it", "FORBIDDEN");
    }
    if (tournament.state !== "draft") throw new HttpError(409, "Tournament cannot be opened", "INVALID_TOURNAMENT_STATE");
    tournament.state = "open";
    await tournament.save();
    response.json({ tournament });
  }));

tournamentRoutes.post("/:id/registrations", requireSession, requireRole("coach", "admin"),
  validate(tournamentRegistrationSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as { clubId: string };
    const tournament = await registerClubForTournament(
      String(request.params.id),
      data.clubId,
      request.user!.id,
      request.user!.roles ?? [],
    );
    response.status(201).json({ tournament });
  }));

tournamentRoutes.delete("/:id/registrations/:clubId", requireSession, requireRole("coach", "admin"),
  asyncHandler(async (request, response) => {
    const tournament = await cancelTournamentRegistration(
      String(request.params.id),
      String(request.params.clubId),
      request.user!.id,
      request.user!.roles ?? [],
    );
    response.json({ tournament });
  }));

tournamentRoutes.post("/:id/fixtures/generate", requireSession, requireRole("admin"),
  validate(generateFixturesSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as { groupCount?: number };
    const stages = await generateAndPersistFixtures(String(request.params.id), data.groupCount);
    response.status(201).json({ stages });
  }));

tournamentRoutes.get("/:id/standings/:stageId", asyncHandler(async (request, response) => {
  const standings = await StandingModel.find({
    tournamentId: String(request.params.id),
    stageId: String(request.params.stageId),
  }).lean();
  response.json({ standings });
}));
