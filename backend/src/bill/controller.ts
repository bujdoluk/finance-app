import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { BillCreateBody, BillUpdateBody } from "./index";
import billService from "./service";
import { validateCreateBill, validateUpdateBill } from "./validation";

export const getAllBills = (_req: Request, res: Response) => {
  const bills = billService.getAllBills();
  res.json(bills);
};

export const getBillById = (req: Request<{ id: string }>, res: Response) => {
  const bill = billService.getBillById(Number(req.params.id));
  if (!bill) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bill not found" });
  res.json(bill);
};

export const createBill = (req: Request<object, object, BillCreateBody>, res: Response) => {
  const error = validateCreateBill(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const bill = billService.createBill(req.body);
  res.status(StatusCodes.CREATED).json({ bill, message: "Bill created" });
};

export const updateBill = (req: Request<{ id: string }, object, BillUpdateBody>, res: Response) => {
  const error = validateUpdateBill(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const bill = billService.updateBill(Number(req.params.id), req.body);
  if (!bill) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bill not found" });

  res.json({ bill, message: "Bill updated" });
};

export const deleteBill = (req: Request<{ id: string }>, res: Response) => {
  const bill = billService.deleteBill(Number(req.params.id));
  if (!bill) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bill not found" });

  res.json({ bill, message: "Bill soft deleted" });
};
