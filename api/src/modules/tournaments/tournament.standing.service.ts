import mongoose, { type ClientSession } from "mongoose";
import { StandingModel } from "./tournament.standing.model.js";
import { applyMatchToStanding, emptyStanding } from "./tournament.standing.js";

export async function updateTournamentStandings(
  tournamentId: mongoose.Types.ObjectId,
  stageId: mongoose.Types.ObjectId,
  homeClubId: mongoose.Types.ObjectId,
  awayClubId: mongoose.Types.ObjectId,
  homeGoals: number,
  awayGoals: number,
  session?: ClientSession,
) {
  for (const [teamId, goalsFor, goalsAgainst] of [
    [homeClubId, homeGoals, awayGoals],
    [awayClubId, awayGoals, homeGoals],
  ] as const) {
    const standing = await StandingModel.findOne({ tournamentId, stageId, teamId }).session(session ?? null);
    if (!standing) continue;
    const updated = applyMatchToStanding({
      ...emptyStanding(),
      played: standing.played,
      won: standing.won,
      drawn: standing.drawn,
      lost: standing.lost,
      goalsFor: standing.goalsFor,
      goalsAgainst: standing.goalsAgainst,
      goalDifference: standing.goalDifference,
      points: standing.points,
    }, goalsFor, goalsAgainst);
    Object.assign(standing, updated);
    await standing.save({ session });
  }
}
