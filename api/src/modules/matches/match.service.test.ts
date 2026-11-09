import { describe, expect, it } from "vitest";
import { HttpError } from "../../core/errors.js";
import { setMatchState, transitionMatchState } from "./match.service.js";

describe("match state transitions", () => {
  it("allows the normal confirmation flow", () => {
    expect(() => transitionMatchState("live", "awaiting_confirmation")).not.toThrow();
    expect(() => transitionMatchState("awaiting_confirmation", "completed")).not.toThrow();
  });

  it("rejects backward transitions", () => {
    expect(() => transitionMatchState("completed", "live")).toThrow(HttpError);
  });

  it("allows disputed matches to be resolved", () => {
    expect(() => transitionMatchState("disputed", "completed")).not.toThrow();
  });

  it("requires a reason before disputing a match", () => {
    const match = { state: "awaiting_confirmation" } as Parameters<typeof setMatchState>[0];
    expect(() => setMatchState(match, "disputed")).toThrow(HttpError);
  });

  it("stores the dispute reason", () => {
    const match = { state: "awaiting_confirmation" } as Parameters<typeof setMatchState>[0];
    setMatchState(match, "disputed", "The submitted score is incorrect");
    expect(match.state).toBe("disputed");
    expect(match.disputeReason).toBe("The submitted score is incorrect");
  });
});
