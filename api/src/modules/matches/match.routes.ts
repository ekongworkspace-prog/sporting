import { Router } from "express";
import { asyncHandler } from "../../core/http.js";
import { HttpError } from "../../core/errors.js";
import { requireSession } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/roleGuard.js";
import { validate } from "../../middleware/validate.js";
import { MatchModel } from "./match.model.js";
import { RefereeAssignmentModel } from "./refereeAssignment.model.js";
import {
  assignmentResponseSchema,
  assignRefereeSchema,
  createMatchSchema,
  matchTransitionSchema,
  submitResultSchema,
} from "./match.schema.js";
import {
  cancelMatchBooking,
  createMatch,
  getTransitionMatch,
  requireAcceptedReferee,
  requireMatchTeamMember,
  setMatchState,
} from "./match.service.js";
import { updateTournamentStandings } from "../tournaments/tournament.standing.service.js";

export const matchRoutes = Router();

matchRoutes.get("/", asyncHandler(async (_request, response) => {
  response.json({ matches: await MatchModel.find().sort({ startAt: 1 }).lean() });
}));

matchRoutes.post("/", requireSession, requireRole("coach", "admin"), validate(createMatchSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as {
      type: "friendly" | "bet";
      opponentId: string;
      homeClubId: string;
      awayClubId: string;
      pitchId: string;
      startAt: string;
      endAt: string;
      refereeId?: string;
      linesmanIds: string[];
    };
    const match = await createMatch({
      ...data,
      creatorId: request.user!.id,
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
    });
    response.status(201).json({ match });
  }));

matchRoutes.post("/:id/state", requireSession, requireRole("coach", "referee", "admin"), validate(matchTransitionSchema),
  asyncHandler(async (request, response) => {
    const match = await getTransitionMatch(String(request.params.id));
    const data = request.validated as { state: string; reason?: string };
    if (data.state === "disputed" && !request.user!.roles?.includes("admin")) {
      throw new HttpError(403, "Only an admin can resolve or raise disputes", "FORBIDDEN");
    }
    await requireMatchTeamMember(match as Parameters<typeof requireMatchTeamMember>[0], request.user!.id, request.user!.roles ?? []);
    if (request.user!.roles?.includes("referee") && !request.user!.roles?.includes("admin")) {
      await requireAcceptedReferee(match as Parameters<typeof requireAcceptedReferee>[0], request.user!.id, request.user!.roles ?? []);
    }
    setMatchState(match as Parameters<typeof setMatchState>[0], data.state, data.reason);
    await match.save();
    if (data.state === "cancelled") await cancelMatchBooking(match._id);
    response.json({ match });
  }));

matchRoutes.post("/:id/result", requireSession, requireRole("referee", "admin"), validate(submitResultSchema),
  asyncHandler(async (request, response) => {
    const match = await getTransitionMatch(String(request.params.id));
    await requireAcceptedReferee(match as Parameters<typeof requireAcceptedReferee>[0], request.user!.id, request.user!.roles ?? []);
    if (!["live", "awaiting_confirmation"].includes(match.state)) {
      throw new HttpError(409, "Match is not ready for a result", "INVALID_MATCH_STATE");
    }
    const data = request.validated as { homeGoals: number; awayGoals: number };
    match.result = { ...data, submittedBy: request.user!.id };
    match.confirmations = [request.user!.id];
    match.state = "awaiting_confirmation";
    await match.save();
    response.json({ match });
  }));

matchRoutes.post("/:id/confirm", requireSession, requireRole("coach", "admin"),
  asyncHandler(async (request, response) => {
    const match = await getTransitionMatch(String(request.params.id));
    if (match.state !== "awaiting_confirmation") {
      throw new HttpError(409, "Match is not awaiting confirmation", "INVALID_MATCH_STATE");
    }
    await requireMatchTeamMember(match as Parameters<typeof requireMatchTeamMember>[0], request.user!.id, request.user!.roles ?? []);
    if (!match.confirmations.includes(request.user!.id)) {
      match.confirmations.push(request.user!.id);
    }
    if (match.confirmations.length >= 2) match.state = "completed";
    await match.save();
    if (match.state === "completed" && match.tournamentId && match.tournamentStageId && match.result) {
      await updateTournamentStandings(
        match.tournamentId,
        match.tournamentStageId,
        match.homeClubId,
        match.awayClubId,
        match.result.homeGoals,
        match.result.awayGoals,
      );
    }
    response.json({ match });
  }));

matchRoutes.post("/:id/assignments", requireSession, requireRole("coach", "admin"), validate(assignRefereeSchema),
  asyncHandler(async (request, response) => {
    const match = await getTransitionMatch(String(request.params.id));
    const data = request.validated as { refereeId: string; role: "referee" | "linesman" };
    const assignment = await RefereeAssignmentModel.create({
      matchId: match._id,
      refereeId: data.refereeId,
      role: data.role,
      status: "pending",
    });
    response.status(201).json({ assignment });
  }));

matchRoutes.post("/:matchId/assignments/:assignmentId/respond", requireSession, requireRole("referee"),
  validate(assignmentResponseSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as { status: "accepted" | "declined" };
    const assignment = await RefereeAssignmentModel.findOne({
      _id: String(request.params.assignmentId),
      matchId: String(request.params.matchId),
      refereeId: request.user!.id,
    });
    if (!assignment) throw new HttpError(404, "Assignment not found", "ASSIGNMENT_NOT_FOUND");
    assignment.status = data.status;
    await assignment.save();
    response.json({ assignment });
  }));
