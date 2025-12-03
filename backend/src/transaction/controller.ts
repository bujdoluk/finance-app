import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createError, createErrorDocument } from "../utils/jsonapi/error";
import { TransactionCreateBody } from "./index";
import transactionService from "./service";
import { validateCreateTransaction } from "./validation";

export const getAllTransactions = (_req: Request, res: Response) => {
  try {
    const transactions = transactionService.getAllTransactions();
    return res.json(transactions);
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const getTransactionById = (req: Request<{ id: string }>, res: Response) => {
  try {
    const t = transactionService.getTransactionById(Number(req.params.id));
    if (!t) {
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Transaction not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json(t);
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
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
    if (errorDoc) return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);

    const t = transactionService.createTransaction(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "Transaction created",
      transaction: t,
    });
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const deleteTransaction = (req: Request<{ id: string }>, res: Response) => {
  try {
    const t = transactionService.deleteTransaction(Number(req.params.id));
    if (!t) {
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Transaction not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json({ message: "Transaction soft deleted", transaction: t });
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};
