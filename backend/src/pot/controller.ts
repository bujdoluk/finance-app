import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createError, createErrorDocument } from "../utils/jsonapi/error";
import logger, { formatValidationMessage, getErrorMessage } from "../utils/logger/logger";
import { PotCreateBody, PotDepositWithdrawBody, PotUpdateBody } from "./index";
import { potService } from "./service";
import { validateCreatePot, validateDepositWithdraw, validateUpdatePot } from "./validation";

const formatValidationErrors = (errors: unknown[]): string => {
  return errors
    .map(e => {
      if (typeof e === "string") return formatValidationMessage(e);
      if (e && typeof e === "object" && "message" in e && typeof e.message === "string") return formatValidationMessage(e.message);
      return "[Invalid error]";
    })
    .join(" ");
};

export const getAllPots = (_req: Request, res: Response) => {
  try {
    const pots = potService.getAllPots();
    return res.json(pots);
  } catch (err: unknown) {
    logger.error(`getAllPots error: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          err instanceof Error ? err.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const getPotById = (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pot = potService.getPotById(id);

    if (!pot) {
      logger.warn(`getPotById: Pot not found [potId=${String(id)}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json(pot);
  } catch (err: unknown) {
    logger.error(`getPotById error [potId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          err instanceof Error ? err.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const createPot = (req: Request<unknown, unknown, PotCreateBody>, res: Response) => {
  try {
    const errorDoc = validateCreatePot(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`createPot validation failed. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const pot = potService.createPot(req.body);
    return res.status(StatusCodes.CREATED).json({ message: "Pot created", pot });
  } catch (err: unknown) {
    logger.error(`createPot error: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          err instanceof Error ? err.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const updatePot = (req: Request<{ id: string }, unknown, PotUpdateBody>, res: Response) => {
  try {
    const errorDoc = validateUpdatePot(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`updatePot validation failed [potId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const pot = potService.updatePot(Number(req.params.id), req.body);
    if (!pot) {
      logger.warn(`updatePot: Pot not found [potId=${req.params.id}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "Pot updated", pot });
  } catch (err: unknown) {
    logger.error(`updatePot error [potId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const deletePot = (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pot = potService.deletePot(id);

    if (!pot) {
      logger.warn(`deletePot: Pot not found [potId=${String(id)}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "Pot soft deleted", pot });
  } catch (err: unknown) {
    logger.error(`deletePot error [potId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const depositToPot = (req: Request<{ id: string }, unknown, PotDepositWithdrawBody>, res: Response) => {
  try {
    const errorDoc = validateDepositWithdraw(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`depositToPot validation failed [potId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const pot = potService.deposit(Number(req.params.id), req.body);
    if (!pot) {
      logger.warn(`depositToPot: Pot not found [potId=${req.params.id}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "Deposit successful", pot });
  } catch (err: unknown) {
    logger.error(`depositToPot error [potId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const withdrawFromPot = (req: Request<{ id: string }, unknown, PotDepositWithdrawBody>, res: Response) => {
  try {
    const errorDoc = validateDepositWithdraw(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`withdrawFromPot validation failed [potId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const pot = potService.withdraw(Number(req.params.id), req.body);
    if (!pot) {
      logger.warn(`withdrawFromPot: Insufficient funds or Pot not found [potId=${req.params.id}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.BAD_REQUEST, "Bad Request", "Insufficient funds or pot not found", { pointer: "/data/attributes/amount" }),
        ])
      );
    }

    return res.json({ message: "Withdrawal successful", pot });
  } catch (err: unknown) {
    logger.error(`withdrawFromPot error [potId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};
