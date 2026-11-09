import { Router } from "express";
import { asyncHandler } from "../../core/http.js";
import { requireSession } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/roleGuard.js";
import { validate } from "../../middleware/validate.js";
import { BetModel } from "./bet.model.js";
import { acceptBetSchema, createBetSchema, settleBetSchema } from "./bet.schema.js";
import { acceptBet, createBet, settleBet } from "./bet.service.js";

export const betRoutes = Router();

betRoutes.get("/", asyncHandler(async (_request, response) => {
  response.json({ bets: await BetModel.find().sort({ createdAt: -1 }).lean() });
}));

betRoutes.post("/", requireSession, validate(createBetSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as {
      matchId: string;
      creatorOutcome: "home" | "draw" | "away";
      stakeKobo: number;
    };
    const bet = await createBet({
      ...data,
      creatorId: request.user!.id,
      roles: request.user!.roles ?? [],
    });
    response.status(201).json({ bet });
  }));

betRoutes.post("/:id/accept", requireSession, validate(acceptBetSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as { acceptorOutcome: "home" | "draw" | "away" };
    const bet = await acceptBet(
      String(request.params.id),
      request.user!.id,
      request.user!.roles ?? [],
      data.acceptorOutcome,
    );
    response.json({ bet });
  }));

betRoutes.post("/:id/settle", requireSession, requireRole("admin"), validate(settleBetSchema),
  asyncHandler(async (request, response) => {
    const data = request.validated as { winningOutcome: "home" | "draw" | "away" };
    const bet = await settleBet(String(request.params.id), data.winningOutcome);
    response.json({ bet });
  }));
