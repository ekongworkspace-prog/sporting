import type { ErrorRequestHandler } from "express";
import { HttpError } from "../core/errors.js";
import { logger } from "../core/logger.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const code = error instanceof HttpError ? error.code : `INTERNAL_SERVER_ERROR ${error.code || ""}`;

  if (statusCode >= 500) {
    logger.error(error);
  }

  response.status(statusCode).json({
    error: {
      code,
      message:  error.message,
    },
  });
};
