import { Request, Response } from "express";

import { Pot, PotCreateBody, PotDepositWithdrawBody, pots, PotUpdateBody } from "../pot/index";

export const getAllPots = (req: Request, res: Response) => {
  res.json(pots.filter(p => !p.deleted_at));
};

export const getPotById = (req: Request<{ id: string }>, res: Response) => {
  const pot = pots.find(p => p.id === Number(req.params.id) && !p.deleted_at);
  if (!pot) return res.status(404).json({ message: "Pot not found" });
  res.json(pot);
};

export const createPot = (req: Request<unknown, unknown, PotCreateBody>, res: Response) => {
  const { amount, name, target, theme, total_saved } = req.body;

  if (!name || !theme || !target || !total_saved || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newPot: Pot = {
    amount,
    created_at: new Date().toISOString(),
    deleted_at: false,
    id: pots.length ? pots[pots.length - 1].id + 1 : 1,
    name,
    target,
    theme,
    total_saved,
    updated_at: new Date().toISOString(),
  };

  pots.push(newPot);
  return res.status(201).json({ message: "Pot created", pot: newPot });
};

export const updatePot = (req: Request<{ id: string }, unknown, PotUpdateBody>, res: Response) => {
  const pot = pots.find(p => p.id === Number(req.params.id) && !p.deleted_at);
  if (!pot) return res.status(404).json({ message: "Pot not found" });

  const body = req.body;
  if (body.total_saved !== undefined) pot.total_saved = body.total_saved;
  if (body.target !== undefined) pot.target = body.target;

  pot.updated_at = new Date().toISOString();
  res.json({ message: "Pot updated", pot });
};

export const deletePot = (req: Request<{ id: string }>, res: Response) => {
  const pot = pots.find(p => p.id === Number(req.params.id) && !p.deleted_at);
  if (!pot) return res.status(404).json({ message: "Pot not found" });

  pot.deleted_at = true;
  pot.updated_at = new Date().toISOString();
  res.json({ message: "Pot soft deleted", pot });
};

export const depositToPot = (req: Request<{ id: string }, unknown, PotDepositWithdrawBody>, res: Response) => {
  const pot = pots.find(p => p.id === Number(req.params.id) && !p.deleted_at);
  if (!pot) return res.status(404).json({ message: "Pot not found" });

  const { amount } = req.body;
  if (typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ message: "Amount must be a positive number" });

  pot.total_saved += amount;
  pot.updated_at = new Date().toISOString();

  res.json({ message: `Deposited $${String(amount)} to pot`, pot });
};

export const withdrawFromPot = (req: Request<{ id: string }, unknown, PotDepositWithdrawBody>, res: Response) => {
  const pot = pots.find(p => p.id === Number(req.params.id) && !p.deleted_at);
  if (!pot) return res.status(404).json({ message: "Pot not found" });

  const { amount } = req.body;
  if (typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ message: "Amount must be a positive number" });

  if (amount > pot.total_saved)
    return res.status(400).json({ message: "Insufficient funds in pot" });

  pot.total_saved -= amount;
  pot.updated_at = new Date().toISOString();

  res.json({ message: `Withdrew $${String(amount)} from pot`, pot });
};
