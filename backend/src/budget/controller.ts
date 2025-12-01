import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { BudgetAmountBody, BudgetCreateBody, BudgetUpdateBody } from "./index";
import budgetService from "./service";
import { validateCreateBudget, validateDepositWithdraw, validateUpdateBudget } from "./validation";

export const getAllBudgets = (_req: Request, res: Response) => {
  const budgets = budgetService.getAllBudgets();
  return res.json(budgets);
};

export const getBudgetById = (req: Request<{ id: string }>, res: Response) => {
  const budget = budgetService.getBudgetById(Number(req.params.id));
  if (!budget) return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });
  return res.json(budget);
};

export const createBudget = (req: Request<object, object, BudgetCreateBody>, res: Response) => {
  const error = validateCreateBudget(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const budget = budgetService.createBudget(req.body);
  return res.status(StatusCodes.CREATED).json({ budget, message: "Budget created" });
};

export const updateBudget = (req: Request<{ id: string }, object, BudgetUpdateBody>, res: Response) => {
  const error = validateUpdateBudget(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const budget = budgetService.updateBudget(Number(req.params.id), req.body);
  if (!budget) return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });

  return res.json({ budget, message: "Budget updated" });
};

export const deleteBudget = (req: Request<{ id: string }>, res: Response) => {
  const budget = budgetService.deleteBudget(Number(req.params.id));
  if (!budget) return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });

  return res.json({ budget, message: "Budget soft deleted" });
};

export const depositToBudget = (req: Request<{ id: string }, object, BudgetAmountBody>, res: Response) => {
  const error = validateDepositWithdraw(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const budget = budgetService.depositToBudget(Number(req.params.id), req.body);
  if (!budget) return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });

  return res.json({ budget, message: `Deposited $${String(req.body.amount)} to budget` });
};

export const withdrawFromBudget = (req: Request<{ id: string }, object, BudgetAmountBody>, res: Response) => {
  const error = validateDepositWithdraw(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const budget = budgetService.withdrawFromBudget(Number(req.params.id), req.body);
  if (!budget) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Insufficient funds or budget not found" });

  return res.json({ budget, message: `Withdrew $${String(req.body.amount)} from budget` });
};
