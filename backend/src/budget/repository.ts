import logger, { getErrorMessage } from "../utils/logger/logger";
import { Budget, BudgetAmountBody, budgets } from "./index";

export const budgetRepository = {
  create(budget: Budget): Budget {
    try {
      budgets.push(budget);
      return budget;
    } catch (err: unknown) {
      logger.error(`create budget failed [budgetId=${String(budget.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  deposit(budget: Budget, body: BudgetAmountBody): Budget {
    try {
      budget.maximumSpending += body.amount;
      budget.updated_at = new Date().toISOString();
      return budget;
    } catch (err: unknown) {
      logger.error(`deposit to budget failed [budgetId=${String(budget.id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  findAll(): Budget[] {
    try {
      return budgets.filter(b => !b.deleted_at);
    } catch (err: unknown) {
      logger.error(`findAll budgets failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  findById(id: number): Budget | undefined {
    try {
      return budgets.find(b => b.id === id && !b.deleted_at);
    } catch (err: unknown) {
      logger.error(`findById failed [budgetId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  softDelete(budget: Budget): Budget {
    try {
      budget.deleted_at = true;
      budget.updated_at = new Date().toISOString();
      return budget;
    } catch (err: unknown) {
      logger.error(`softDelete failed [budgetId=${String(budget.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  update(budget: Budget): Budget {
    try {
      budget.updated_at = new Date().toISOString();
      return budget;
    } catch (err: unknown) {
      logger.error(`update budget failed [budgetId=${String(budget.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  withdraw(budget: Budget, body: BudgetAmountBody): Budget | null {
    try {
      if (body.amount > budget.maximumSpending) return null;

      budget.maximumSpending -= body.amount;
      budget.updated_at = new Date().toISOString();
      return budget;
    } catch (err: unknown) {
      logger.error(`withdraw from budget failed [budgetId=${String(budget.id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  }
};

export default budgetRepository;
