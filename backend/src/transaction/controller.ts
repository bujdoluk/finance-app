import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { TransactionCreateBody } from "./index";
import transactionService from "./service";
import { validateCreateTransaction } from "./validation";

export const getAllTransactions = (_req: Request, res: Response) => {
  const transactions = transactionService.getAllTransactions();
  res.json(transactions);
};

export const getTransactionById = (req: Request<{ id: string }>, res: Response) => {
  const transaction = transactionService.getTransactionById(Number(req.params.id));
  if (!transaction) return res.status(StatusCodes.NOT_FOUND).json({ message: "Transaction not found" });
  res.json(transaction);
};

export const createTransaction = (req: Request<object, object, TransactionCreateBody>, res: Response) => {
  const error = validateCreateTransaction(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const transaction = transactionService.createTransaction(req.body);
  res.status(StatusCodes.CREATED).json({ message: "Transaction created", transaction });
};

export const deleteTransaction = (req: Request<{ id: string }>, res: Response) => {
  const transaction = transactionService.deleteTransaction(Number(req.params.id));
  if (!transaction) return res.status(StatusCodes.NOT_FOUND).json({ message: "Transaction not found" });

  res.json({ message: "Transaction soft deleted", transaction });
};
