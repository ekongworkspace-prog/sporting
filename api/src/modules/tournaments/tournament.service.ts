import mongoose, { type ClientSession } from "mongoose";
import { HttpError } from "../../core/errors.js";
import { withTransaction } from "../../core/transactions.js";
import { ClubModel } from "../clubs/club.model.js";
import { LedgerEntryModel, WalletModel } from "../wallets/wallet.model.js";
import { TournamentModel, type Tournament } from "./tournament.model.js";
import { generateGroupsKnockout, generateLeagueFixtures, generateSeededKnockout } from "./tournament.fixture.js";
import { TournamentStageModel } from "./tournament.stage.model.js";
import { StandingModel } from "./tournament.standing.model.js";

export function validateTournamentCapacity(tournament: Pick<Tournament, "teamCount" | "registeredTeamIds">) {
  if (tournament.registeredTeamIds.length >= tournament.teamCount) {
    throw new HttpError(409, "Tournament team capacity is full", "TOURNAMENT_FULL");
  }
}

export function validateRegistrationOpen(tournament: Tournament) {
  if (tournament.state !== "open") {
    throw new HttpError(409, "Tournament registration is not open", "REGISTRATION_CLOSED");
  }
  if (tournament.registrationClosesAt <= new Date()) {
    throw new HttpError(409, "Tournament registration deadline has passed", "REGISTRATION_CLOSED");
  }
}

async function requireClubOwner(clubId: string, userId: string, roles: string[], session: ClientSession) {
  const club = await ClubModel.findById(clubId).session(session);
  if (!club) throw new HttpError(404, "Club not found", "CLUB_NOT_FOUND");
  if (!roles.includes("admin") && club.ownerId !== userId) {
    throw new HttpError(403, "Only the club owner can register this club", "FORBIDDEN");
  }
  return club;
}

async function moveClubWallet(input: {
  walletId: mongoose.Types.ObjectId;
  direction: "debit" | "credit";
  amountKobo: number;
  reason: string;
  reference: string;
  session: ClientSession;
}) {
  const wallet = await WalletModel.findById(input.walletId).session(input.session);
  if (!wallet) throw new HttpError(404, "Club wallet not found", "WALLET_NOT_FOUND");
  if (input.direction === "debit" && wallet.balanceKobo < input.amountKobo) {
    throw new HttpError(409, "Insufficient club wallet balance", "INSUFFICIENT_BALANCE");
  }

  const idempotencyKey = `tournament:${input.direction}:${input.reference}:${wallet._id.toString()}`;
  if (await LedgerEntryModel.exists({ idempotencyKey }).session(input.session)) return wallet;

  wallet.balanceKobo += input.direction === "credit" ? input.amountKobo : -input.amountKobo;
  await wallet.save({ session: input.session });
  await LedgerEntryModel.create([{
    walletId: wallet._id,
    direction: input.direction,
    amountKobo: input.amountKobo,
    reason: input.reason,
    reference: input.reference,
    idempotencyKey,
  }], { session: input.session });
  return wallet;
}

export async function registerClubForTournament(tournamentId: string, clubId: string, userId: string, roles: string[]) {
  return withTransaction(async (session) => {
    const tournament = await TournamentModel.findById(tournamentId).session(session);
    if (!tournament) throw new HttpError(404, "Tournament not found", "TOURNAMENT_NOT_FOUND");
    validateRegistrationOpen(tournament);
    validateTournamentCapacity(tournament);
    if (tournament.registeredTeamIds.some((registeredId) => registeredId.toString() === clubId)) {
      throw new HttpError(409, "Club is already registered", "ALREADY_REGISTERED");
    }

    const club = await requireClubOwner(clubId, userId, roles, session);
    if (!club.walletId) throw new HttpError(409, "Club wallet has not been created", "WALLET_NOT_FOUND");
    if (tournament.entryFeeKobo > 0) {
      await moveClubWallet({
        walletId: club.walletId,
        direction: "debit",
        amountKobo: tournament.entryFeeKobo,
        reason: "tournament entry fee",
        reference: tournament._id.toString(),
        session,
      });
    }

    tournament.registeredTeamIds.push(club._id);
    await tournament.save({ session });
    return tournament;
  });
}

export async function cancelTournamentRegistration(tournamentId: string, clubId: string, userId: string, roles: string[]) {
  return withTransaction(async (session) => {
    const tournament = await TournamentModel.findById(tournamentId).session(session);
    if (!tournament) throw new HttpError(404, "Tournament not found", "TOURNAMENT_NOT_FOUND");
    if (!["draft", "open"].includes(tournament.state)) {
      throw new HttpError(409, "Registration cannot be cancelled", "REGISTRATION_CLOSED");
    }

    const registered = tournament.registeredTeamIds.some((registeredId) => registeredId.toString() === clubId);
    if (!registered) throw new HttpError(404, "Club is not registered", "NOT_REGISTERED");
    const club = await requireClubOwner(clubId, userId, roles, session);
    if (!club.walletId) throw new HttpError(409, "Club wallet has not been created", "WALLET_NOT_FOUND");

    if (tournament.entryFeeKobo > 0) {
      await moveClubWallet({
        walletId: club.walletId,
        direction: "credit",
        amountKobo: tournament.entryFeeKobo,
        reason: "tournament registration refund",
        reference: tournament._id.toString(),
        session,
      });
    }
    tournament.registeredTeamIds = tournament.registeredTeamIds.filter((id) => id.toString() !== clubId);
    await tournament.save({ session });
    return tournament;
  });
}

export async function generateAndPersistFixtures(tournamentId: string, groupCount?: number) {
      if (!mongoose.isValidObjectId(tournamentId)) {
        throw new HttpError(400, "Invalid tournament id", "INVALID_TOURNAMENT_ID");
      }
      return withTransaction(async (session) => {
        const tournament = await TournamentModel.findById(tournamentId).session(session);
        if (!tournament) throw new HttpError(404, "Tournament not found", "TOURNAMENT_NOT_FOUND");
        if (tournament.registeredTeamIds.length < 2) {
          throw new HttpError(409, "At least two teams are required", "TOURNAMENT_NOT_READY");
        }
        const teams = tournament.registeredTeamIds.map((id, index) => ({ id: id.toString(), seed: index + 1 }));
        await TournamentStageModel.deleteMany({ tournamentId: tournament._id }, { session });
        await StandingModel.deleteMany({ tournamentId: tournament._id }, { session });

        if (tournament.format === "league") {
          const fixtures = generateLeagueFixtures(teams, tournament.legs as 1 | 2);
          const [stage] = await TournamentStageModel.create([{
            tournamentId: tournament._id,
            name: "League",
            type: "group",
            order: 1,
            fixtures: fixtures.map((fixture) => ({
              ...fixture,
              homeTeamId: fixture.homeTeamId,
              awayTeamId: fixture.awayTeamId,
            })),
          }], { session });
          await createStageStandings(tournament._id, stage._id, tournament.registeredTeamIds, session);
          return [stage];
        }

        if (tournament.format === "knockout") {
          const rounds = generateSeededKnockout(teams);
          const fixtures = rounds.flat().map((fixture, index) => ({
            ...fixture,
            homeTeamId: fixture.homeTeamId.startsWith("winner:") ? undefined : fixture.homeTeamId,
            awayTeamId: fixture.awayTeamId.startsWith("winner:") ? undefined : fixture.awayTeamId,
            homeTeamPlaceholder: fixture.homeTeamId.startsWith("winner:") ? fixture.homeTeamId : undefined,
            awayTeamPlaceholder: fixture.awayTeamId.startsWith("winner:") ? fixture.awayTeamId : undefined,
          }));
          const [stage] = await TournamentStageModel.create([{
            tournamentId: tournament._id, name: "Knockout", type: "knockout", order: 1, fixtures,
          }], { session });
          await createStageStandings(tournament._id, stage._id, tournament.registeredTeamIds, session);
          return [stage];
        }

        const generated = generateGroupsKnockout(teams, groupCount ?? Math.max(2, Math.ceil(teams.length / 4)));
        const stages: any[] = [];
        for (const group of generated.groups) {
          const [stage] = await TournamentStageModel.create([{
            tournamentId: tournament._id,
            name: `Group ${group.group}`,
            type: "group",
            order: group.group,
            fixtures: group.fixtures.map((fixture) => ({
              ...fixture,
              group: group.group,
              homeTeamId: fixture.homeTeamId,
              awayTeamId: fixture.awayTeamId,
            })),
          }], { session });
          await createStageStandings(
            tournament._id,
            stage._id,
            group.teams.map((team) => new mongoose.Types.ObjectId(team.id)),
            session,
          );
          stages.push(stage);
        }
        return stages;
      });
    }

    async function createStageStandings(
      tournamentId: mongoose.Types.ObjectId,
      stageId: mongoose.Types.ObjectId,
      teamIds: mongoose.Types.ObjectId[],
      session: ClientSession,
    ) {
      await StandingModel.create(teamIds.map((teamId) => ({
        tournamentId,
        stageId,
        teamId,
      })), { session });
    }
