import { describe, expect, it } from "vitest";
import { contractsOverlap } from "./contract.service.js";

describe("contract service", () => {
  it("detects overlapping contract periods", () => {
    expect(contractsOverlap(
      new Date("2026-01-01"),
      new Date("2026-12-31"),
      new Date("2026-06-01"),
      new Date("2027-06-01"),
    )).toBe(true);
  });

  it("allows adjacent contract periods", () => {
    expect(contractsOverlap(
      new Date("2026-01-01"),
      new Date("2026-06-01"),
      new Date("2026-06-02"),
      new Date("2027-06-01"),
    )).toBe(false);
  });
});
