import { describe, expect, it } from "vitest";
import { HttpError } from "../../core/errors.js";
import { validateRegistrationOpen, validateTournamentCapacity } from "./tournament.service.js";

describe("tournament registration", () => {
  it("rejects registration after the deadline", () => {
    const tournament = {
      state: "open",
      registrationClosesAt: new Date("2020-01-01"),
    } as Parameters<typeof validateRegistrationOpen>[0];
    expect(() => validateRegistrationOpen(tournament)).toThrow(HttpError);
  });

  it("rejects a full tournament", () => {
    const tournament = {
      teamCount: 2,
      registeredTeamIds: [{}, {}],
    } as unknown as Parameters<typeof validateTournamentCapacity>[0];
    expect(() => validateTournamentCapacity(tournament)).toThrow(HttpError);
  });

  it("allows capacity below the team limit", () => {
    const tournament = {
      teamCount: 2,
      registeredTeamIds: [{}],
    } as unknown as Parameters<typeof validateTournamentCapacity>[0];
    expect(() => validateTournamentCapacity(tournament)).not.toThrow();
  });
});
