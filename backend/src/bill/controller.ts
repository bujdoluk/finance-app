import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Bill } from "./index";
import billService, { BillCreateData } from "./service";
import { isAmountValid, isFrequencyValid, isNameValid, isNextRunValid } from "./validation";

export const getAllBills = (_req: Request, res: Response) => {
  try {
    const bills = billService.getAllBills();
    return res.json(bills);
  } catch (err: unknown) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
};

export const getBillById = (req: Request<{ id: string }>, res: Response) => {
  try {
    const bill = billService.getBillById(Number(req.params.id));
    if (!bill) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bill not found" });
    return res.json(bill);
  } catch (err: unknown) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
};

export const createBill = (req: Request<object, object, Partial<Bill>>, res: Response) => {
  try {
    const { amount, frequency, name, next_run } = req.body;

    if (!isNameValid(name)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Name is required" });
    }

    if (!isAmountValid(amount)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Amount must be a positive number" });
    }

    if (!isNextRunValid(next_run)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Next run date is required" });
    }

    if (!isFrequencyValid(frequency)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Frequency is required" });
    }

    const billData: BillCreateData = { amount, frequency, name, next_run };
    const bill = billService.createBill(billData);
    return res.status(StatusCodes.CREATED).json({ bill, message: "Bill created" });
  } catch (err: unknown) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
};

export const updateBill = (req: Request<{ id: string }, object, Partial<Bill>>, res: Response) => {
  try {
    const { amount, frequency, name, next_run } = req.body;

    if (!isNameValid(name, false)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Name cannot be empty" });
    }

    if (!isAmountValid(amount, false)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Amount must be a positive number" });
    }

    if (!isNextRunValid(next_run, false)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Next run date cannot be empty" });
    }

    if (!isFrequencyValid(frequency, false)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Frequency cannot be empty" });
    }

    const bill = billService.updateBill(Number(req.params.id), req.body);
    if (!bill) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bill not found" });

    return res.json({ bill, message: "Bill updated" });
  } catch (err: unknown) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
};

export const deleteBill = (req: Request<{ id: string }>, res: Response) => {
  try {
    const bill = billService.deleteBill(Number(req.params.id));
    if (!bill) return res.status(StatusCodes.NOT_FOUND).json({ message: "Bill not found" });

    return res.json({ bill, message: "Bill soft deleted" });
  } catch (err: unknown) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
};
