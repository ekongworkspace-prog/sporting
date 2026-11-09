import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { HttpError } from "../core/errors.js";

export function validate(schema: ZodSchema): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      return next(new HttpError(400, "Invalid request", "VALIDATION_ERROR"));
    }
    request.validated = result.data;
    next();
  };
}

declare global {
  namespace Express {
    interface Request {
      validated?: unknown;
    }
  }
}
