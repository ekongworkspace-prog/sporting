export interface FixtureTeam {
  id: string;
  seed?: number;
}

export interface Fixture {
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  leg: 1 | 2;
}

export function generateLeagueFixtures(teams: FixtureTeam[], legs: 1 | 2 = 1): Fixture[] {
  if (teams.length < 2) return [];
  const rotation = teams.length % 2 === 0 ? [...teams] : [...teams, { id: "__bye__" }];
  const fixtures: Fixture[] = [];
  const rounds = rotation.length - 1;

  for (let round = 0; round < rounds; round += 1) {
    for (let match = 0; match < rotation.length / 2; match += 1) {
      const home = rotation[match];
      const away = rotation[rotation.length - 1 - match];
      if (home.id !== "__bye__" && away.id !== "__bye__") {
        fixtures.push({
          round: round + 1,
          homeTeamId: round % 2 === 0 ? home.id : away.id,
          awayTeamId: round % 2 === 0 ? away.id : home.id,
          leg: 1,
        });
      }
    }
    rotation.splice(1, 0, rotation.pop()!);
  }

  if (legs === 2) {
    return [
      ...fixtures,
      ...fixtures.map((fixture) => ({
        ...fixture,
        leg: 2 as const,
        homeTeamId: fixture.awayTeamId,
        awayTeamId: fixture.homeTeamId,
      })),
    ];
  }
  return fixtures;
}

export function generateSeededKnockout(teams: FixtureTeam[]): Fixture[][] {
  if (teams.length < 2) return [];
  const ordered = [...teams].sort((a, b) => (a.seed ?? Number.MAX_SAFE_INTEGER) - (b.seed ?? Number.MAX_SAFE_INTEGER));
  const bracketSize = 2 ** Math.ceil(Math.log2(ordered.length));
  let seedOrder = [1, 2];
  while (seedOrder.length < bracketSize) {
    const nextSize = seedOrder.length * 2;
    seedOrder = seedOrder.flatMap((seed) => [seed, nextSize + 1 - seed]);
  }
  const slots = seedOrder.map((seed) => ordered[seed - 1]?.id ?? "__bye__");

  const rounds: Fixture[][] = [];
  const firstRound: Fixture[] = [];
  for (let match = 0; match < slots.length / 2; match += 1) {
    const home = slots[match * 2];
    const away = slots[match * 2 + 1];
    if (home !== "__bye__" && away !== "__bye__") {
      firstRound.push({ round: 1, homeTeamId: home, awayTeamId: away, leg: 1 });
    }
  }
  rounds.push(firstRound);

  let matchCount = bracketSize / 4;
  for (let round = 2; roundCount(bracketSize) >= round - 1 && matchCount >= 1; round += 1) {
    const roundFixtures = Array.from({ length: matchCount }, (_, index) => ({
      round,
      homeTeamId: `winner:R${round - 1}:M${index * 2 + 1}`,
      awayTeamId: `winner:R${round - 1}:M${index * 2 + 2}`,
      leg: 1 as const,
    }));
    rounds.push(roundFixtures);
    matchCount = Math.floor(matchCount / 2);
  }
  return rounds;
}

export function generateGroupsKnockout(teams: FixtureTeam[], groupCount: number): {
  groups: Array<{ group: number; teams: FixtureTeam[]; fixtures: Fixture[] }>;
  knockout: Fixture[][];
} {
  if (groupCount < 1 || groupCount > teams.length) {
    throw new Error("groupCount must be between 1 and the number of teams");
  }
  const groups = Array.from({ length: groupCount }, (_, index) => ({ group: index + 1, teams: [] as FixtureTeam[], fixtures: [] as Fixture[] }));
  teams.forEach((team, index) => groups[index % groupCount].teams.push(team));
  groups.forEach((group) => {
    group.fixtures = generateLeagueFixtures(group.teams);
  });

  const qualifiers = groups.flatMap((group) => group.teams.slice(0, 2));
  return { groups, knockout: generateSeededKnockout(qualifiers) };
}

function roundCount(bracketSize: number): number {
  return Math.log2(bracketSize);
}
