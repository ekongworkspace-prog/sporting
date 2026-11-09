import { describe, expect, it } from "vitest";

describe("wallet amounts", () => {
  it("accepts integer kobo values", () => {
    expect(Number.isSafeInteger(10_500)).toBe(true);
  });

  it("rejects fractional currency values", () => {
    expect(Number.isSafeInteger(105.5)).toBe(false);
  });
});
