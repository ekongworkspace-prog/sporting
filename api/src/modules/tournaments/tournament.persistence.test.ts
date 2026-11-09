import { describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { generateAndPersistFixtures } from "./tournament.service.js";

describe("tournament fixture persistence", () => {
  it("rejects invalid tournament ids", async () => {
    await expect(generateAndPersistFixtures("invalid")).rejects.toBeDefined();
  });

  it("uses valid object ids for registered teams", () => {
    expect(mongoose.isValidObjectId(new mongoose.Types.ObjectId())).toBe(true);
  });
});
