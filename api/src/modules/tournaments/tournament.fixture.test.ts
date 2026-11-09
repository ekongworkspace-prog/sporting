import { describe, expect, it } from "vitest";
import {
  generateGroupsKnockout,
  generateLeagueFixtures,
  generateSeededKnockout,
} from "./tournament.fixture.js";

describe("tournament fixtures", () => {
  const teams = ["a", "b", "c", "d"].map((id, index) => ({ id, seed: index + 1 }));

  it("creates one fixture per team pair in a round robin", () => {
    const fixtures = generateLeagueFixtures(teams);
    const pairs = new Set(fixtures.map((fixture) => [fixture.homeTeamId, fixture.awayTeamId].sort().join(":")));
    expect(fixtures).toHaveLength(6);
    expect(pairs.size).toBe(6);
  });

  it("creates two legs in reverse order", () => {
    const fixtures = generateLeagueFixtures(teams, 2);
    expect(fixtures.filter((fixture) => fixture.leg === 1)).toHaveLength(6);
    expect(fixtures.filter((fixture) => fixture.leg === 2)).toHaveLength(6);
  });

  it("fills knockout byes and never pairs a team with itself", () => {
    const rounds = generateSeededKnockout(teams.slice(0, 3));
    expect(rounds.flat().length).toBeGreaterThan(0);
    rounds.flat().forEach((fixture) => {
      expect(fixture.homeTeamId).not.toBe("__bye__");
      expect(fixture.awayTeamId).not.toBe("__bye__");
      expect(fixture.homeTeamId).not.toBe(fixture.awayTeamId);
    });
  });

  it("generates group fixtures and knockout qualifiers", () => {
    const result = generateGroupsKnockout(teams, 2);
    expect(result.groups).toHaveLength(2);
    expect(result.groups.flatMap((group) => group.fixtures).length).toBeGreaterThan(0);
    expect(result.knockout.length).toBeGreaterThan(0);
  });
});
