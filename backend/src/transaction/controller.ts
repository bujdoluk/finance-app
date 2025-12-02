import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TransactionCreateBody } from "index";

import transactionService from "./service";
import { validateCreateTransaction } from "./validation";

export const getAllTransactions = (_req: Request, res: Response) => {
  return res.json(transactionService.getAllTransactions());
};

export const getTransactionById = (req: Request<{ id: string }>, res: Response) => {
  const t = transactionService.getTransactionById(Number(req.params.id));
  if (!t) return res.status(StatusCodes.NOT_FOUND).json({ message: "Transaction not found" });

  return res.json(t);
};

export const createTransaction = (
  req: Request<unknown, unknown, TransactionCreateBody>,
  res: Response
) => {
  const error = validateCreateTransaction(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }

  const t = transactionService.createTransaction(req.body);
  return res.status(StatusCodes.CREATED).json({
    message: "Transaction created",
    transaction: t
  });
};

export const deleteTransaction = (req: Request<{ id: string }>, res: Response) => {
  const t = transactionService.deleteTransaction(Number(req.params.id));
  if (!t) return res.status(StatusCodes.NOT_FOUND).json({ message: "Transaction not found" });

  return res.json({ message: "Transaction soft deleted", transaction: t });
};
