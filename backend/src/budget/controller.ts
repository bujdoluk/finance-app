import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createError, createErrorDocument } from "../utils/jsonapi/error";
import logger, { formatValidationMessage, getErrorMessage } from "../utils/logger/logger";
import { BudgetAmountBody, BudgetCreateBody, BudgetUpdateBody } from "./index";
import budgetService from "./service";
import { validateCreateBudget, validateDepositWithdraw, validateUpdateBudget } from "./validation";

const formatValidationErrors = (errors: unknown[]): string => {
  return errors
    .map(e => {
      if (typeof e === "string") return formatValidationMessage(e);
      if (e && typeof e === "object" && "message" in e && typeof e.message === "string") return formatValidationMessage(e.message);
      return "[Invalid error]";
    })
    .join(" ");
};

export const getAllBudgets = (_req: Request, res: Response) => {
  try {
    const budgets = budgetService.getAllBudgets();
    return res.json(budgets);
  } catch (err: unknown) {
    logger.error(`getAllBudgets error: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const getBudgetById = (req: Request<{ id: string }>, res: Response) => {
  try {
    const budget = budgetService.getBudgetById(Number(req.params.id));
    if (!budget) {
      logger.warn(`getBudgetById: Budget not found [budgetId=${req.params.id}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json(budget);
  } catch (err: unknown) {
    logger.error(`getBudgetById error [budgetId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const createBudget = (req: Request<object, object, BudgetCreateBody>, res: Response) => {
  try {
    const errorDoc = validateCreateBudget(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`createBudget validation failed. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const budget = budgetService.createBudget(req.body);
    return res.status(StatusCodes.CREATED).json({ budget, message: "Budget created" });
  } catch (err: unknown) {
    logger.error(`createBudget error: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const updateBudget = (req: Request<{ id: string }, object, BudgetUpdateBody>, res: Response) => {
  try {
    const errorDoc = validateUpdateBudget(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`updateBudget validation failed [budgetId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const budget = budgetService.updateBudget(Number(req.params.id), req.body);
    if (!budget) {
      logger.warn(`updateBudget: Budget not found [budgetId=${req.params.id}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ budget, message: "Budget updated" });
  } catch (err: unknown) {
    logger.error(`updateBudget error [budgetId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const deleteBudget = (req: Request<{ id: string }>, res: Response) => {
  try {
    const budget = budgetService.deleteBudget(Number(req.params.id));
    if (!budget) {
      logger.warn(`deleteBudget: Budget not found [budgetId=${req.params.id}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json({ budget, message: "Budget soft deleted" });
  } catch (err: unknown) {
    logger.error(`deleteBudget error [budgetId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const depositToBudget = (req: Request<{ id: string }, object, BudgetAmountBody>, res: Response) => {
  try {
    const errorDoc = validateDepositWithdraw(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`depositToBudget validation failed [budgetId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const budget = budgetService.depositToBudget(Number(req.params.id), req.body);
    if (!budget) {
      logger.warn(`depositToBudget: Budget not found [budgetId=${req.params.id}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ budget, message: `Deposited $${String(req.body.amount)} to budget` });
  } catch (err: unknown) {
    logger.error(`depositToBudget error [budgetId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const withdrawFromBudget = (req: Request<{ id: string }, object, BudgetAmountBody>, res: Response) => {
  try {
    const errorDoc = validateDepositWithdraw(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`withdrawFromBudget validation failed [budgetId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const budget = budgetService.withdrawFromBudget(Number(req.params.id), req.body);
    if (!budget) {
      logger.warn(`withdrawFromBudget: Insufficient funds or Budget not found [budgetId=${req.params.id}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.BAD_REQUEST, "Bad Request", "Insufficient funds or budget not found", { pointer: "/data/attributes/amount" }),
        ])
      );
    }

    return res.json({ budget, message: `Withdrew $${String(req.body.amount)} from budget` });
  } catch (err: unknown) {
    logger.error(`withdrawFromBudget error [budgetId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};
