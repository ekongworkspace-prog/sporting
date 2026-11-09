import { describe, expect, it } from "vitest";
import { applyMatchToStanding, emptyStanding, sortStandings } from "./tournament.standing.js";

describe("tournament standings", () => {
  it("awards three points for a win", () => {
    expect(applyMatchToStanding(emptyStanding(), 2, 1)).toMatchObject({
      played: 1, won: 1, goalsFor: 2, goalsAgainst: 1, goalDifference: 1, points: 3,
    });
  });

  it("sorts by points, goal difference, and goals scored", () => {
    const sorted = sortStandings([
      { ...emptyStanding(), points: 3, goalDifference: 1, goalsFor: 2 },
      { ...emptyStanding(), points: 4, goalDifference: 0, goalsFor: 1 },
    ]);
    expect(sorted[0].points).toBe(4);
  });
});
