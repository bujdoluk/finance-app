import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Transactions, TransactionsInput } from "../../database/dbSchema";
import { createError, createErrorDocument } from "../utils/jsonapi/error";
import logger, { formatValidationMessage, getErrorMessage } from "../utils/logger/logger";
import { mapToTransactionResource } from "./mapper";
import transactionService from "./service";
import { validateCreateTransaction } from "./validation";

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const results = await transactionService.get(req.query);
    return res.json(results.map(mapToTransactionResource));
  } catch (err: unknown) {
    logger.error(`getTransactions error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.BAD_REQUEST).json(
      createErrorDocument([
        createError(
          StatusCodes.BAD_REQUEST,
          "Invalid filter or sort",
          err instanceof Error ? err.message : "Bad query format"
        ),
      ])
    );
  }
};

export const getTransactionCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await transactionService.getCategories();
    return res.json(categories);
  } catch (err: unknown) {
    logger.error(`getTransactionCategories error: ${getErrorMessage(err)}`);

    return res.status(StatusCodes.BAD_REQUEST).json(
      createErrorDocument([
        createError(
          StatusCodes.BAD_REQUEST,
          "Error retrieving categories",
          err instanceof Error ? err.message : "Unknown error"
        ),
      ])
    );
  }
};

export const getTransactionById = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const transaction: null | Transactions = await transactionService.getById(id);

    if (!transaction) {
      logger.warn(`getTransactionById: Transaction not found [transactionId=${String(id)}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Transaction not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.status(StatusCodes.OK).json(mapToTransactionResource(transaction));
  } catch (err: unknown) {
    logger.error(`getTransactionById error [transactionId=${req.params.id}]: ${getErrorMessage(err)}`);
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

export const createTransaction = async (req: Request<unknown, unknown, TransactionsInput>, res: Response): Promise<Response> => {
  try {
    const errorDoc = validateCreateTransaction(req.body);
    if (errorDoc) {
      const messages = errorDoc.errors
        .map((e) => {
          if (typeof e === "string") return e;
          if ("message" in e && typeof e.message === "string") return e.message;
          return "[Unknown validation error]";
        })
        .map(formatValidationMessage)
        .join(" ");

      logger.warn(`createTransaction validation failed. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const transaction: Transactions = await transactionService.create(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "Transaction created",
      transaction: mapToTransactionResource(transaction),
    });
  } catch (err: unknown) {
    logger.error(`createTransaction error: ${getErrorMessage(err)}`);
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

export const deleteTransaction = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const transaction: null | Transactions = await transactionService.delete(id);

    if (!transaction) {
      logger.warn(`deleteTransaction: Transaction not found [transactionId=${String(id)}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Transaction not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.status(StatusCodes.OK).json({
      message: "Transaction soft deleted",
      transaction: mapToTransactionResource(transaction),
    });
  } catch (err: unknown) {
    logger.error(`deleteTransaction error [transactionId=${req.params.id}]: ${getErrorMessage(err)}`);
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