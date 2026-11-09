export interface StandingValues {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export const emptyStanding = (): StandingValues => ({
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  points: 0,
});

export function applyMatchToStanding(
  standing: StandingValues,
  goalsFor: number,
  goalsAgainst: number,
): StandingValues {
  const result = { ...standing };
  result.played += 1;
  result.goalsFor += goalsFor;
  result.goalsAgainst += goalsAgainst;
  result.goalDifference = result.goalsFor - result.goalsAgainst;
  if (goalsFor > goalsAgainst) {
    result.won += 1;
    result.points += 3;
  } else if (goalsFor === goalsAgainst) {
    result.drawn += 1;
    result.points += 1;
  } else {
    result.lost += 1;
  }
  return result;
}

export function sortStandings<T extends StandingValues>(standings: T[]): T[] {
  return [...standings].sort((a, b) =>
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor);
}
