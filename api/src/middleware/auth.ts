import type { RequestHandler } from "express";
import { HttpError } from "../core/errors.js";
import { auth } from "../config/auth.js";

export const requireSession: RequestHandler = async (request, _response, next) => {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(request.headers)) {
      if (typeof value === "string") headers.set(key, value);
      else if (Array.isArray(value)) headers.set(key, value.join(", "));
    }

    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) {
      return next(new HttpError(401, "Authentication required", "UNAUTHENTICATED"));
    }

    const sessionUser = session.user as typeof session.user & { role?: string | string[]; roles?: string[] };
    const roles = Array.isArray(sessionUser.roles)
      ? sessionUser.roles
      : Array.isArray(sessionUser.role)
        ? sessionUser.role
        : typeof sessionUser.role === "string"
          ? sessionUser.role.split(",").map((role) => role.trim())
          : ["player"];
    request.user = { id: session.user.id, email: sessionUser.email, roles };
    next();
  } catch (error) {
    next(error);
  }
};

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email?: string; roles?: string[] };
    }
  }
}
