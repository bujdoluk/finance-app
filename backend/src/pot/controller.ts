import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";

import { PotsInput } from "../../database/dbSchema";
import { createError, createErrorDocument, joiToErrors } from "../utils/jsonapi/error";
import logger, { formatValidationMessage, getErrorMessage } from "../utils/logger/logger";
import { mapToPotResource, mapToPotsResponse } from "./mapper";
import potService from "./service";
import { createPotSchema, depositWithdrawSchema, updatePotSchema } from "./validation";

const formatValidationErrors = (errors: Joi.ValidationErrorItem[]): string => {
  return errors.map(e => formatValidationMessage(e.message)).join(" ");
};

export const getAllPots = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { rows, total } = await potService.get(req.query);
    return res.json(mapToPotsResponse(rows, total, req));
  } catch (err: unknown) {
    logger.error(`getAllPots error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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

export const getPotById = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const potId = Number(req.params.id);
    const pot = await potService.getById(potId);

    if (!pot) {
      logger.warn(`getPotById: Pot not found [potId=${String(potId)}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json(mapToPotResource(pot));
  } catch (err: unknown) {
    logger.error(`getPotById error [potId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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

export const createPot = async (req: Request<unknown, unknown, PotsInput>, res: Response): Promise<Response> => {
  try {
    const validation = createPotSchema.validate(req.body, { abortEarly: false });
    const error = validation.error;
    const value = validation.value as PotsInput;

    if (error) {
      const messages = formatValidationErrors(error.details);
      logger.warn(`createPot validation failed. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(joiToErrors(error.details, StatusCodes.BAD_REQUEST));
    }

    const pot = await potService.create(value);
    return res.status(StatusCodes.CREATED).json({ message: "Pot created", pot: mapToPotResource(pot) });
  } catch (err: unknown) {
    logger.error(`createPot error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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

export const deletePot = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const potId = Number(req.params.id);
    const pot = await potService.delete(potId);

    if (!pot) {
      logger.warn(`deletePot: Pot not found [potId=${String(potId)}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "Pot soft deleted", pot: mapToPotResource(pot) });
  } catch (err: unknown) {
    logger.error(`deletePot error [potId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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

export const depositToPot = async (req: Request<{ id: string }, unknown, PotsInput>, res: Response): Promise<Response> => {
  try {
    const validation = depositWithdrawSchema.validate(req.body, { abortEarly: false });
    const error = validation.error;
    const value = validation.value as PotsInput;

    if (error) {
      const messages = formatValidationErrors(error.details);
      logger.warn(`depositToPot validation failed [potId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(joiToErrors(error.details, StatusCodes.BAD_REQUEST));
    }

    const pot = await potService.deposit(Number(req.params.id), value);
    if (!pot) {
      logger.warn(`depositToPot: Pot not found [potId=${req.params.id}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" })])
      );
    }

    return res.json({ message: "Deposit successful", pot: mapToPotResource(pot) });
  } catch (err: unknown) {
    logger.error(`depositToPot error [potId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong")])
    );
  }
};

export const withdrawFromPot = async (req: Request<{ id: string }, unknown, PotsInput>, res: Response): Promise<Response> => {
  try {
    const potId = Number(req.params.id);

    const validation = depositWithdrawSchema.validate(req.body, { abortEarly: false });
    const error = validation.error;
    const value = validation.value as PotsInput;

    if (error) {
      const messages = formatValidationErrors(error.details);
      logger.warn(`withdrawFromPot validation failed [potId=${String(potId)}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(joiToErrors(error.details, StatusCodes.BAD_REQUEST));
    }

    const pot = await potService.withdraw(potId, value);
    if (!pot) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        createErrorDocument([createError(StatusCodes.BAD_REQUEST, "Bad Request", "Insufficient funds or pot not found", { pointer: "/data/attributes/amount" })])
      );
    }

    return res.json({ message: "Withdrawal successful", pot: mapToPotResource(pot) });
  } catch (err: unknown) {
    logger.error(`withdrawFromPot error [potId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong")])
    );
  }
};