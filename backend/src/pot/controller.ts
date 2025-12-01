import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  PotCreateBody,
  PotDepositWithdrawBody,
  PotUpdateBody
} from "./index";
import { potService } from "./service";
import {
  validateCreatePot,
  validateDepositWithdraw,
  validateUpdatePot
} from "./validation";

export const getAllPots = (_req: Request, res: Response) => {
  res.json(potService.getAllPots());
};

export const getPotById = (req: Request<{ id: string }>, res: Response) => {
  const pot = potService.getPotById(Number(req.params.id));
  if (!pot) return res.status(StatusCodes.NOT_FOUND).json({ message: "Pot not found" });
  return res.json(pot);
};

export const createPot = (
  req: Request<unknown, unknown, PotCreateBody>,
  res: Response
) => {
  const error = validateCreatePot(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const pot = potService.createPot(req.body);
  return res.status(StatusCodes.CREATED).json({ message: "Pot created", pot });
};

export const updatePot = (
  req: Request<{ id: string }, unknown, PotUpdateBody>,
  res: Response
) => {
  const error = validateUpdatePot(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const pot = potService.updatePot(Number(req.params.id), req.body);
  if (!pot) return res.status(StatusCodes.NOT_FOUND).json({ message: "Pot not found" });

  return res.json({ message: "Pot updated", pot });
};

export const deletePot = (req: Request<{ id: string }>, res: Response) => {
  const pot = potService.deletePot(Number(req.params.id));
  if (!pot) return res.status(StatusCodes.NOT_FOUND).json({ message: "Pot not found" });

  return res.json({ message: "Pot soft deleted", pot });
};

export const depositToPot = (
  req: Request<{ id: string }, unknown, PotDepositWithdrawBody>,
  res: Response
) => {
  const error = validateDepositWithdraw(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const pot = potService.deposit(Number(req.params.id), req.body);
  if (!pot) return res.status(StatusCodes.NOT_FOUND).json({ message: "Pot not found" });

  return res.json({ message: "Deposit successful", pot });
};

export const withdrawFromPot = (
  req: Request<{ id: string }, unknown, PotDepositWithdrawBody>,
  res: Response
) => {
  const error = validateDepositWithdraw(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const pot = potService.withdraw(Number(req.params.id), req.body);
  if (!pot) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Insufficient funds or pot not found" });

  return res.json({ message: "Withdrawal successful", pot });
};
