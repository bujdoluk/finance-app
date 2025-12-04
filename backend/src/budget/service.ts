import { Resource } from "../utils/jsonapi/resource";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { Budget, BudgetAmountBody, BudgetCreateBody, BudgetUpdateBody } from "./index";
import { mapToBudgetResource } from "./mapper";
import budgetRepository from "./repository";

const budgetService = {
  createBudget(body: BudgetCreateBody): Resource {
    try {
      const allBudgets = budgetRepository.findAll();
      const newId = allBudgets.length ? allBudgets[allBudgets.length - 1].id + 1 : 1;

      const newBudget: Budget = {
        ...body,
        created_at: new Date().toISOString(),
        deleted_at: false,
        id: newId,
        updated_at: new Date().toISOString(),
      };

      const createdBudget = budgetRepository.create(newBudget);
      return mapToBudgetResource(createdBudget);
    } catch (err: unknown) {
      logger.error(`createBudget failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  deleteBudget(id: number): Resource | undefined {
    try {
      const budget = budgetRepository.findById(id);
      if (!budget) return undefined;

      const deleted = budgetRepository.softDelete(budget);
      return mapToBudgetResource(deleted);
    } catch (err: unknown) {
      logger.error(`deleteBudget failed [budgetId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  depositToBudget(id: number, body: BudgetAmountBody): Resource | undefined {
    try {
      const budget = budgetRepository.findById(id);
      if (!budget) return undefined;

      const updated = budgetRepository.deposit(budget, body);
      return mapToBudgetResource(updated);
    } catch (err: unknown) {
      logger.error(`depositToBudget failed [budgetId=${String(id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getAllBudgets(): Resource[] {
    try {
      return budgetRepository.findAll().map(mapToBudgetResource);
    } catch (err: unknown) {
      logger.error(`getAllBudgets failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getBudgetById(id: number): Resource | undefined {
    try {
      const budget = budgetRepository.findById(id);
      return budget ? mapToBudgetResource(budget) : undefined;
    } catch (err: unknown) {
      logger.error(`getBudgetById failed [budgetId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  updateBudget(id: number, body: BudgetUpdateBody): Resource | undefined {
    try {
      const budget = budgetRepository.findById(id);
      if (!budget) return undefined;

      Object.assign(budget, body);
      const updated = budgetRepository.update(budget);
      return mapToBudgetResource(updated);
    } catch (err: unknown) {
      logger.error(`updateBudget failed [budgetId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  withdrawFromBudget(id: number, body: BudgetAmountBody): Resource | undefined {
    try {
      const budget = budgetRepository.findById(id);
      if (!budget) return undefined;

      const updated = budgetRepository.withdraw(budget, body);
      return updated ? mapToBudgetResource(updated) : undefined;
    } catch (err: unknown) {
      logger.error(`withdrawFromBudget failed [budgetId=${String(id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default budgetService;
