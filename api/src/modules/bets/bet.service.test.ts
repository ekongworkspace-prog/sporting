import { describe, expect, it } from "vitest";
import { platformFee } from "./bet.service.js";

describe("bet service", () => {
  it("calculates the default five percent fee in kobo", () => {
    expect(platformFee(20_000)).toBe(1_000);
  });

  it("rounds platform fees down", () => {
    expect(platformFee(1)).toBe(0);
  });
});
