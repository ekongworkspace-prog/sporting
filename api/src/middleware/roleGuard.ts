import type { RequestHandler } from "express";
import { HttpError } from "../core/errors.js";

export type Role = "player" | "coach" | "referee" | "owner" | "venue_manager" | "admin" | "user";

export function requireRole(...allowedRoles: Role[]): RequestHandler {
  return (request, _response, next) => {
    const roles = request.user?.roles ?? ["user"];
    if (!roles.some((role) => allowedRoles.includes(role as Role))) {
      return next(new HttpError(403, "requireRole", "requireRole"));
    }
    next();
  };
}

export const requireProfileRole: RequestHandler = (request, _response, next) => {
  const profileType = Array.isArray(request.params.type) ? request.params.type[0] : request.params.type;
  if (!profileType || !["player", "coach", "referee", "owner"].includes(profileType)) {
    return next(new HttpError(403, "requireProfileRole", "requireProfileRole"));
  }

  const roles = request.user?.roles ?? ["user"];
  if (!roles.some((role) => role.toLowerCase() === profileType || role === "admin")) {
    return next(new HttpError(403, `${roles} - ${profileType}`, "FORBIDDEN"));
  }
  
  next();
};
