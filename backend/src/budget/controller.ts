import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createError, createErrorDocument } from "../utils/jsonapi/error";
import { BudgetAmountBody, BudgetCreateBody, BudgetUpdateBody } from "./index";
import budgetService from "./service";
import { 
  validateCreateBudget, 
  validateDepositWithdraw, 
  validateUpdateBudget 
} from "./validation";

export const getAllBudgets = (_req: Request, res: Response) => {
  try {
    const budgets = budgetService.getAllBudgets();
    return res.json(budgets);
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const getBudgetById = (req: Request<{ id: string }>, res: Response) => {
  try {
    const budget = budgetService.getBudgetById(Number(req.params.id));
    if (!budget) {
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json(budget);
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const createBudget = (req: Request<object, object, BudgetCreateBody>, res: Response) => {
  try {
    const errorDoc = validateCreateBudget(req.body);
    if (errorDoc) return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);

    const budget = budgetService.createBudget(req.body);
    return res.status(StatusCodes.CREATED).json({ budget, message: "Budget created" });
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const updateBudget = (req: Request<{ id: string }, object, BudgetUpdateBody>, res: Response) => {
  try {
    const errorDoc = validateUpdateBudget(req.body);
    if (errorDoc) return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);

    const budget = budgetService.updateBudget(Number(req.params.id), req.body);
    if (!budget) {
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ budget, message: "Budget updated" });
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const deleteBudget = (req: Request<{ id: string }>, res: Response) => {
  try {
    const budget = budgetService.deleteBudget(Number(req.params.id));
    if (!budget) {
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json({ budget, message: "Budget soft deleted" });
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const depositToBudget = (req: Request<{ id: string }, object, BudgetAmountBody>, res: Response) => {
  try {
    const errorDoc = validateDepositWithdraw(req.body);
    if (errorDoc) return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);

    const budget = budgetService.depositToBudget(Number(req.params.id), req.body);
    if (!budget) {
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ budget, message: `Deposited $${String(req.body.amount)} to budget` });
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const withdrawFromBudget = (req: Request<{ id: string }, object, BudgetAmountBody>, res: Response) => {
  try {
    const errorDoc = validateDepositWithdraw(req.body);
    if (errorDoc) return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);

    const budget = budgetService.withdrawFromBudget(Number(req.params.id), req.body);
    if (!budget) {
      return res.json(
        createErrorDocument([
          createError(
            StatusCodes.BAD_REQUEST,
            "Bad Request",
            "Insufficient funds or budget not found",
            { pointer: "/data/attributes/amount" }
          ),
        ])
      );
    }

    return res.json({ budget, message: `Withdrew $${String(req.body.amount)} from budget` });
  } catch (e) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};
