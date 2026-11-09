import { describe, expect, it } from "vitest";
import { allowedPatch, maskNin } from "./profile.service.js";

describe("profile service", () => {
  it("masks a NIN in API responses", () => {
    expect(maskNin("12345678901")).toBe("****8901");
  });

  it("handles missing NIN values", () => {
    expect(maskNin(undefined)).toBe("");
  });

  it("allows only player fields for player updates", () => {
    expect(allowedPatch("player", {
      fullName: "Ada Player",
      club: "Unauthorized Club",
      strength: 90,
    })).toEqual({ fullName: "Ada Player" });
  });

  it("allows role-specific referee fields", () => {
    expect(allowedPatch("referee", {
      licenseNumber: "REF-123",
      teamsCoached: ["Unauthorized Team"],
    })).toEqual({ licenseNumber: "REF-123" });
  });

  it("allows role-specific coach fields", () => {
    expect(allowedPatch("coach", {
      teamsCoached: ["Team A"],
      rating: 5,
    })).toEqual({ teamsCoached: ["Team A"] });
  });
});
