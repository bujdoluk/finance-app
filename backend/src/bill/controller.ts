import { Request, Response } from "express";
import {
	StatusCodes,
} from 'http-status-codes';

import { Bill, BillCreateBody, bills, BillUpdateBody } from "../bill/index";

export const getAllBills = (req: Request, res: Response) => {
  return res.json(bills.filter(b => !b.deleted_at));
};

export const getBillById = (
  req: Request<{ id: string }>,
  res: Response
) => {
  const bill = bills.find(b => b.id === Number(req.params.id) && !b.deleted_at);
  if (!bill) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bill not found" });

  return res.json(bill);
};

export const createBill = (
  req: Request<Record<string, never>, unknown, BillCreateBody>,
  res: Response
) => {
  const { amount, frequency, name, next_run } = req.body;

  if (!name || !amount || !next_run) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
  }

  const newBill: Bill = {
    amount,
    created_at: new Date().toISOString(),
    deleted_at: false,
    frequency,
    id: bills.length ? bills[bills.length - 1].id + 1 : 1,
    name,
    next_run,
    updated_at: new Date().toISOString()
  };

  bills.push(newBill);
  return res.status(StatusCodes.CREATED).json({ bill: newBill, message: "Bill created" });
};

export const updateBill = (
  req: Request<{ id: string }, unknown, BillUpdateBody>,
  res: Response
) => {
  const bill = bills.find(b => b.id === Number(req.params.id) && !b.deleted_at);
  if (!bill) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bill not found" });

  const body = req.body;

  if (body.name !== undefined) bill.name = body.name;
  if (body.amount !== undefined) bill.amount = body.amount;
  if (body.frequency !== undefined) bill.frequency = body.frequency;
  if (body.next_run !== undefined) bill.next_run = body.next_run;

  bill.updated_at = new Date().toISOString();

  return res.json({ bill, message: "Bill updated" });
};

export const deleteBill = (req: Request<{ id: string }>, res: Response) => {
  const bill = bills.find(b => b.id === Number(req.params.id) && !b.deleted_at);
  if (!bill) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bill not found" });

  bill.deleted_at = true;
  bill.updated_at = new Date().toISOString();

  return res.json({ bill, message: "Bill deleted" });
};
