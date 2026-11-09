import mongoose, { type ClientSession } from "mongoose";
import { HttpError } from "../../core/errors.js";
import { withTransaction } from "../../core/transactions.js";
import { ClubModel } from "../clubs/club.model.js";
import { MatchModel } from "../matches/match.model.js";
import { RefereeAssignmentModel } from "../matches/refereeAssignment.model.js";
import { LedgerEntryModel, WalletModel } from "../wallets/wallet.model.js";
import { BetModel } from "./bet.model.js";

export const PLATFORM_FEE_BPS = 500;

export function platformFee(amountKobo: number, feeBps = PLATFORM_FEE_BPS) {
  return Math.floor(amountKobo * feeBps / 10_000);
}

async function moveWallet(
  userId: string,
  amountKobo: number,
  direction: "debit" | "credit",
  reason: string,
  reference: string,
  session: ClientSession,
) {
  const wallet = await WalletModel.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, currency: "NGN", balanceKobo: 0 } },
    { new: true, upsert: true, setDefaultsOnInsert: true, session },
  );
  if (direction === "debit" && wallet.balanceKobo < amountKobo) {
    throw new HttpError(409, "Insufficient wallet balance", "INSUFFICIENT_BALANCE");
  }
  const idempotencyKey = `bet:${direction}:${reference}:${userId}`;
  if (await LedgerEntryModel.exists({ idempotencyKey }).session(session)) return wallet;
  wallet.balanceKobo += direction === "credit" ? amountKobo : -amountKobo;
  await wallet.save({ session });
  await LedgerEntryModel.create([{
    walletId: wallet._id,
    direction,
    amountKobo,
    reason,
    reference,
    idempotencyKey,
  }], { session });
  return wallet;
}

async function requireBetEligible(match: InstanceType<typeof MatchModel>, userId: string, roles: string[], session: ClientSession) {
  if (roles.includes("admin")) return;
  if (roles.includes("player") || roles.includes("referee")) {
    throw new HttpError(403, "Players and referees cannot bet on matches", "BET_FORBIDDEN");
  }
  if (match.creatorId === userId || match.opponentId === userId || match.refereeId === userId) {
    throw new HttpError(403, "Match participants cannot bet on this match", "BET_FORBIDDEN");
  }
  if (match.linesmanIds.includes(userId)) {
    throw new HttpError(403, "Match officials cannot bet on this match", "BET_FORBIDDEN");
  }
  const clubs = await ClubModel.find({
    _id: { $in: [match.homeClubId, match.awayClubId] },
  }).session(session);
  if (clubs.some((club) => club.ownerId === userId || club.memberIds.includes(userId))) {
    throw new HttpError(403, "Players or coaches participating in this match cannot bet", "BET_FORBIDDEN");
  }
  const acceptedAssignment = await RefereeAssignmentModel.exists({
    matchId: match._id,
    refereeId: userId,
    status: "accepted",
  }).session(session);
  if (acceptedAssignment) throw new HttpError(403, "Match officials cannot bet on this match", "BET_FORBIDDEN");
}

export async function createBet(input: { matchId: string; creatorId: string; roles: string[]; creatorOutcome: "home" | "draw" | "away"; stakeKobo: number }) {
  if (!Number.isSafeInteger(input.stakeKobo) || input.stakeKobo <= 0) {
    throw new HttpError(400, "Stake must be a positive integer number of kobo", "INVALID_AMOUNT");
  }
  return withTransaction(async (session) => {
    const match = await MatchModel.findById(input.matchId).session(session);
    if (!match) throw new HttpError(404, "Match not found", "MATCH_NOT_FOUND");
    if (["completed", "cancelled", "disputed"].includes(match.state)) {
      throw new HttpError(409, "Betting is closed for this match", "BETTING_CLOSED");
    }
    await requireBetEligible(match, input.creatorId, input.roles, session);
    if (await BetModel.exists({ matchId: match._id, creatorId: input.creatorId, state: "open" }).session(session)) {
      throw new HttpError(409, "An open bet already exists for this user and match", "BET_ALREADY_EXISTS");
    }
    await moveWallet(input.creatorId, input.stakeKobo, "debit", "bet escrow", match._id.toString(), session);
    const [bet] = await BetModel.create([{
      matchId: match._id,
      creatorId: input.creatorId,
      creatorOutcome: input.creatorOutcome,
      stakeKobo: input.stakeKobo,
      state: "open",
    }], { session });
    return bet;
  });
}

export async function acceptBet(betId: string, acceptorId: string, roles: string[], acceptorOutcome: "home" | "draw" | "away") {
  return withTransaction(async (session) => {
    const bet = await BetModel.findById(betId).session(session);
    if (!bet) throw new HttpError(404, "Bet not found", "BET_NOT_FOUND");
    if (bet.state !== "open") throw new HttpError(409, "Bet is not open", "BET_NOT_OPEN");
    if (bet.creatorId === acceptorId) throw new HttpError(409, "Creator cannot accept their own bet", "BET_FORBIDDEN");
    if (acceptorOutcome === bet.creatorOutcome) {
      throw new HttpError(400, "Acceptor must pick an opposite outcome", "INVALID_OUTCOME");
    }
    const match = await MatchModel.findById(bet.matchId).session(session);
    if (!match) throw new HttpError(404, "Match not found", "MATCH_NOT_FOUND");
    await requireBetEligible(match, acceptorId, roles, session);
    await moveWallet(acceptorId, bet.stakeKobo, "debit", "bet escrow", bet._id.toString(), session);
    bet.acceptorId = acceptorId;
    bet.acceptorOutcome = acceptorOutcome;
    bet.state = "accepted";
    await bet.save({ session });
    return bet;
  });
}

export async function settleBet(betId: string, winningOutcome: "home" | "draw" | "away") {
  return withTransaction(async (session) => {
    const bet = await BetModel.findById(betId).session(session);
    if (!bet) throw new HttpError(404, "Bet not found", "BET_NOT_FOUND");
    if (!bet.acceptorId) throw new HttpError(409, "Bet has not been accepted", "BET_NOT_ACCEPTED");
    if (bet.state === "settled") return bet;
    if (bet.state !== "accepted") throw new HttpError(409, "Bet cannot be settled", "BET_NOT_SETTLED");
    const totalKobo = bet.stakeKobo * 2;
    const feeKobo = platformFee(totalKobo);
    const winnerId = bet.creatorOutcome === winningOutcome ? bet.creatorId : bet.acceptorId;
    await moveWallet(winnerId, totalKobo - feeKobo, "credit", "bet winnings", bet._id.toString(), session);
    await moveWallet("platform", feeKobo, "credit", "bet platform fee", bet._id.toString(), session);
    bet.winningOutcome = winningOutcome;
    bet.platformFeeKobo = feeKobo;
    bet.state = "settled";
    bet.settledAt = new Date();
    await bet.save({ session });
    return bet;
  });
}

export async function cancelOrRefundBet(betId: string) {
  return withTransaction(async (session) => {
    const bet = await BetModel.findById(betId).session(session);
    if (!bet) throw new HttpError(404, "Bet not found", "BET_NOT_FOUND");
    if (bet.state === "cancelled" || bet.state === "refunded") return bet;
    await moveWallet(bet.creatorId, bet.stakeKobo, "credit", "bet escrow refund", bet._id.toString(), session);
    if (bet.acceptorId) {
      await moveWallet(bet.acceptorId, bet.stakeKobo, "credit", "bet escrow refund", bet._id.toString(), session);
    }
    bet.state = bet.acceptorId ? "refunded" : "cancelled";
    await bet.save({ session });
    return bet;
  });
}
