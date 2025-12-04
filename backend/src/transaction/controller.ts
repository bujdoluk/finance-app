import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createError, createErrorDocument } from "../utils/jsonapi/error";
import logger, { formatValidationMessage, getErrorMessage } from "../utils/logger/logger";
import { TransactionCreateBody } from "./index";
import transactionService from "./service";
import { validateCreateTransaction } from "./validation";

export const getAllTransactions = (_req: Request, res: Response) => {
  try {
    const transactions = transactionService.getAllTransactions();
    return res.json(transactions);
  } catch (err: unknown) {
    logger.error(`getAllTransactions error: ${getErrorMessage(err)}`);
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

export const getTransactionById = (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const t = transactionService.getTransactionById(id);

    if (!t) {
      logger.warn(`getTransactionById: Transaction not found [transactionId=${String(id)}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Transaction not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json(t);
  } catch (err: unknown) {
    logger.error(`getTransactionById error [transactionId=${req.params.id}]: ${getErrorMessage(err)}`);
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

export const createTransaction = (
  req: Request<unknown, unknown, TransactionCreateBody>,
  res: Response
) => {
  try {
    const errorDoc = validateCreateTransaction(req.body);
    if (errorDoc) {
      const messages = errorDoc.errors.map((e) => {
          if (typeof e === 'string') return e;
          if ('message' in e && typeof e.message === 'string') return e.message;
          return '[Unknown validation error]';
      }).map(formatValidationMessage).join(' ');

      logger.warn(`createTransaction validation failed. ${messages}`);

      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const t = transactionService.createTransaction(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "Transaction created",
      transaction: t,
    });
  } catch (err: unknown) {
    logger.error(`createTransaction error: ${getErrorMessage(err)}`);
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

export const deleteTransaction = (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const t = transactionService.deleteTransaction(id);

    if (!t) {
      logger.warn(`deleteTransaction: Transaction not found [transactionId=${String(id)}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Transaction not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "Transaction soft deleted", transaction: t });
  } catch (err: unknown) {
    logger.error(`deleteTransaction error [transactionId=${req.params.id}]: ${getErrorMessage(err)}`);
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
