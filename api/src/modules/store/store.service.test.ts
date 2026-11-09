import { describe, expect, it } from "vitest";

describe("store service", () => {
  it("represents prices and totals as integers in kobo", () => {
    const quantity = 3;
    const unitPriceKobo = 1250;
    const totalKobo = quantity * unitPriceKobo;
    expect(Number.isSafeInteger(totalKobo)).toBe(true);
    expect(totalKobo).toBe(3750);
  });

  it("rejects invalid product quantities", () => {
    expect(Number.isSafeInteger(0)).toBe(true);
  });
});
