import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../utils/errors/AppError";
import { createError, createErrorDocument } from "../utils/jsonapi/error";
import logger, { getErrorMessage } from "../utils/logger/logger";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const message = err instanceof Error ? err.message : "Unknown error";

  logger.error(`Global error handler: ${getErrorMessage(err)}`);

  // AppError → known, user-friendly
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      createErrorDocument([
        createError(err.statusCode, "Error", err.message)
      ])
    );
  }

  // Unknown error → 500
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
    createErrorDocument([
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal Server Error",
        message
      )
    ])
  );
}
