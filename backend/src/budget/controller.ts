import { Request, Response } from "express";
import {
	StatusCodes,
} from 'http-status-codes';

import {
  Budget,
  BudgetAmountBody,
  BudgetCreateBody,
  budgets,
  BudgetUpdateBody
} from "../budget/index";

export const getAllBudgets = (req: Request, res: Response) => {
  return res.json(budgets.filter(b => !b.deleted_at));
};

export const getBudgetById = (
  req: Request<{ id: string }>,
  res: Response
) => {
  const budget = budgets.find(b => b.id === Number(req.params.id) && !b.deleted_at);

  if (!budget) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });
  }

  return res.json(budget);
};

export const createBudget = (
  req: Request<Record<string, never>, object, BudgetCreateBody>,
  res: Response
) => {
  const { amount, maximumSpending, name, theme } = req.body;

  if (!name || !maximumSpending || !theme || !amount) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "name, maximumSpending, theme and amount are required"
    });
  }

  const newBudget: Budget = {
    amount,
    created_at: new Date().toISOString(),
    deleted_at: false,
    id: budgets.length ? budgets[budgets.length - 1].id + 1 : 1,
    maximumSpending,
    name,
    theme,
    updated_at: new Date().toISOString()
  };

  budgets.push(newBudget);
  return res.status(StatusCodes.CREATED).json({ budget: newBudget, message: "Budget created" });
};

export const updateBudget = (
  req: Request<{ id: string }, object, BudgetUpdateBody>,
  res: Response
) => {
  const budget = budgets.find(b => b.id === Number(req.params.id) && !b.deleted_at);

  if (!budget) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });
  }

  const body = req.body;

  if (body.name !== undefined) budget.name = body.name;
  if (body.maximumSpending !== undefined) budget.maximumSpending = body.maximumSpending;
  if (body.theme !== undefined) budget.theme = body.theme;

  budget.updated_at = new Date().toISOString();

  return res.json({ budget, message: "Budget updated" });
};

export const deleteBudget = (
  req: Request<{ id: string }>,
  res: Response
) => {
  const budget = budgets.find(b => b.id === Number(req.params.id) && !b.deleted_at);

  if (!budget) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });
  }

  budget.deleted_at = true;
  budget.updated_at = new Date().toISOString();

  return res.json({ budget, message: "Budget soft deleted" });
};

export const depositToBudget = (
  req: Request<{ id: string }, object, BudgetAmountBody>,
  res: Response
) => {
  const budget = budgets.find(b => b.id === Number(req.params.id) && !b.deleted_at);

  if (!budget) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });
  }

  const { amount } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Amount must be a positive number" });
  }

  budget.maximumSpending += amount;
  budget.updated_at = new Date().toISOString();

  return res.json({ budget, message: `Deposited $${String(amount)} to budget` });
};

export const withdrawFromBudget = (
  req: Request<{ id: string }, object, BudgetAmountBody>,
  res: Response
) => {
  const budget = budgets.find(b => b.id === Number(req.params.id) && !b.deleted_at);

  if (!budget) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });
  }

  const { amount } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Amount must be a positive number" });
  }

  if (amount > budget.maximumSpending) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Insufficient funds" });
  }

  budget.maximumSpending -= amount;
  budget.updated_at = new Date().toISOString();

  return res.json({ budget, message: `Withdrew $${String(amount)} from budget` });
};