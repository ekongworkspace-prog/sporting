import type { ErrorRequestHandler } from "express";
import { HttpError } from "../core/errors.js";
import { logger } from "../core/logger.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const code = error instanceof HttpError ? error.code : "INTERNAL_ERROR";

  if (statusCode >= 500) {
    logger.error(error);
  }

  response.status(statusCode).json({
    error: {
      code,
      message: statusCode >= 500 ? "Internal server error" : error.message,
    },
  });
};
