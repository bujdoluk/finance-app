import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { PotCreateBody, PotDepositWithdrawBody, PotUpdateBody } from "./index";
import potService from "./service";
import { validateCreatePot, validateDepositWithdraw, validateUpdatePot } from "./validation";

export const getAllPots = (_req: Request, res: Response) => {
  const pots = potService.getAllPots();
  res.json(pots);
};

export const getPotById = (req: Request<{ id: string }>, res: Response) => {
  const pot = potService.getPotById(Number(req.params.id));
  if (!pot) return res.status(StatusCodes.NOT_FOUND).json({ message: "Pot not found" });
  res.json(pot);
};

export const createPot = (req: Request<object, object, PotCreateBody>, res: Response) => {
  const error = validateCreatePot(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const pot = potService.createPot(req.body);
  res.status(StatusCodes.CREATED).json({ message: "Pot created", pot });
};

export const updatePot = (req: Request<{ id: string }, object, PotUpdateBody>, res: Response) => {
  const error = validateUpdatePot(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const pot = potService.updatePot(Number(req.params.id), req.body);
  if (!pot) return res.status(StatusCodes.NOT_FOUND).json({ message: "Pot not found" });

  res.json({ message: "Pot updated", pot });
};

export const deletePot = (req: Request<{ id: string }>, res: Response) => {
  const pot = potService.deletePot(Number(req.params.id));
  if (!pot) return res.status(StatusCodes.NOT_FOUND).json({ message: "Pot not found" });

  res.json({ message: "Pot soft deleted", pot });
};

export const depositToPot = (req: Request<{ id: string }, object, PotDepositWithdrawBody>, res: Response) => {
  const error = validateDepositWithdraw(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const pot = potService.depositToPot(Number(req.params.id), req.body);
  if (!pot) return res.status(StatusCodes.NOT_FOUND).json({ message: "Pot not found" });

  res.json({ message: `Deposited $${String(req.body.amount)} to pot`, pot });
};

export const withdrawFromPot = (req: Request<{ id: string }, object, PotDepositWithdrawBody>, res: Response) => {
  const error = validateDepositWithdraw(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const pot = potService.withdrawFromPot(Number(req.params.id), req.body);
  if (!pot) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Insufficient funds or pot not found" });

  res.json({ message: `Withdrew $${String(req.body.amount)} from pot`, pot });
};
