import { BudgetsInput } from "@db/dbSchema";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createError, createErrorDocument } from "../utils/jsonapi/error";
import logger, { formatValidationMessage, getErrorMessage } from "../utils/logger/logger";
import mapToBudgetResource from "./mapper";
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

export const getBudgets = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const budgets = await budgetService.get();
    return res.json(budgets.map(mapToBudgetResource));
  } catch (err: unknown) {
    logger.error(`getAllBudgets error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const getBudgetById = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const budget = await budgetService.getById(Number(req.params.id));
    if (!budget) {
      logger.warn(`getBudgetById: Budget not found [budgetId=${req.params.id}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json(mapToBudgetResource(budget));
  } catch (err: unknown) {
    logger.error(`getBudgetById error [budgetId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const createBudget = async (req: Request<object, object, BudgetsInput>, res: Response): Promise<Response> => {
  try {
    const errorDoc = validateCreateBudget(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`createBudget validation failed. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const budget = await budgetService.create(req.body);
    return res.status(StatusCodes.CREATED).json({ budget: mapToBudgetResource(budget), message: "Budget created" });
  } catch (err: unknown) {
    logger.error(`createBudget error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const updateBudget = async (req: Request<{ id: string }, object, BudgetsInput>, res: Response): Promise<Response> => {
  try {
    const errorDoc = validateUpdateBudget(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`updateBudget validation failed [budgetId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const budget = await budgetService.update(Number(req.params.id), req.body);
    if (!budget) {
      logger.warn(`updateBudget: Budget not found [budgetId=${req.params.id}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ budget: mapToBudgetResource(budget), message: "Budget updated" });
  } catch (err: unknown) {
    logger.error(`updateBudget error [budgetId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const deleteBudget = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const budget = await budgetService.delete(Number(req.params.id));
    if (!budget) {
      logger.warn(`deleteBudget: Budget not found [budgetId=${req.params.id}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json({ budget: mapToBudgetResource(budget), message: "Budget soft deleted" });
  } catch (err: unknown) {
    logger.error(`deleteBudget error [budgetId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const depositToBudget = async (req: Request<{ id: string }, object, BudgetsInput>, res: Response): Promise<Response> => {
  try {
    const errorDoc = validateDepositWithdraw(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`depositToBudget validation failed [budgetId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const budget = await budgetService.deposit(Number(req.params.id), req.body.amount);
    if (!budget) {
      logger.warn(`depositToBudget: Budget not found [budgetId=${req.params.id}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Budget not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ budget: mapToBudgetResource(budget), message: `Deposited $${String(req.body.amount)} to budget` });
  } catch (err: unknown) {
    logger.error(`depositToBudget error [budgetId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const withdrawFromBudget = async (req: Request<{ id: string }, object, BudgetsInput>, res: Response): Promise<Response> => {
  try {
    const errorDoc = validateDepositWithdraw(req.body);
    if (errorDoc) {
      const messages = formatValidationErrors(errorDoc.errors);
      logger.warn(`withdrawFromBudget validation failed [budgetId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);
    }

    const budget = await budgetService.withdraw(Number(req.params.id), req.body.amount);
    if (!budget) {
      logger.warn(`withdrawFromBudget: Insufficient funds or Budget not found [budgetId=${req.params.id}]`);
      return res.status(StatusCodes.BAD_REQUEST).json(
        createErrorDocument([
          createError(StatusCodes.BAD_REQUEST, "Bad Request", "Insufficient funds or budget not found", { pointer: "/data/attributes/amount" }),
        ])
      );
    }

    return res.json({ budget: mapToBudgetResource(budget), message: `Withdrew $${String(req.body.amount)} from budget` });
  } catch (err: unknown) {
    logger.error(`withdrawFromBudget error [budgetId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};
