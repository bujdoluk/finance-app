import { Request, Response } from "express";
import {
	StatusCodes,
} from 'http-status-codes';

import { Transaction, TransactionCreateBody, transactions } from "../transaction/index"; 

export const getAllTransactions = (req: Request, res: Response) => {
  return res.json(transactions.filter(t => !t.deleted_at));
};

export const getTransactionById = (req: Request<{ id: string }>, res: Response) => {
  const transaction = transactions.find(t => t.id === Number(req.params.id) && !t.deleted_at);
  if (!transaction) return res.status(StatusCodes.NOT_FOUND).json({ message: "Transaction not found" });
  return res.json(transaction);
};

export const createTransaction = (
  req: Request<unknown, unknown, TransactionCreateBody>,
  res: Response
) => {
  const { amount, category, date, sender, sender_picture } = req.body;

  if (!date || !category || !sender || !sender_picture) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
  }

  const newTransaction: Transaction = {
    amount,
    category,
    created_at: new Date().toISOString(),
    date,
    deleted_at: false,
    id: transactions.length ? transactions[transactions.length - 1].id + 1 : 1,
    sender,
    sender_picture,
    updated_at: new Date().toISOString(),
  };

  transactions.push(newTransaction);

  return res.status(StatusCodes.CREATED).json({ message: "Transaction created", transaction: newTransaction });
};

export const deleteTransaction = (req: Request<{ id: string }>, res: Response) => {
  const transaction = transactions.find(t => t.id === Number(req.params.id) && !t.deleted_at);
  if (!transaction) return res.status(StatusCodes.NOT_FOUND).json({ message: "Transaction not found" });

  transaction.deleted_at = true;
  transaction.updated_at = new Date().toISOString();
  return res.json({ message: "Transaction soft deleted", transaction });
};
