import { Budgets, BudgetsInput } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";
import budgetRepository from "./repository";

export const budgetService = {
  async create(body: BudgetsInput): Promise<Budgets> {
    try {
      return await budgetRepository.create(body);
    } catch (err: unknown) {
      logger.error(`createBudget failed [name=${body.name}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async delete(id: number): Promise<Budgets | null> {
    try {
      const existingBudget = await budgetRepository.getById(id);
      if (!existingBudget) return null;
      return await budgetRepository.delete(id);
    } catch (err: unknown) {
      logger.error(`deleteBudget failed [budgetId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deposit(id: number, amount: number): Promise<Budgets | null> {
    try {
      const existingBudget = await budgetRepository.getById(id);
      if (!existingBudget) return null;
      return await budgetRepository.deposit(id, amount);
    } catch (err: unknown) {
      logger.error(`depositToBudget failed [budgetId=${String(id)}, amount=${String(amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async get(): Promise<Budgets[]> {
    try {
      return await budgetRepository.get();
    } catch (err: unknown) {
      logger.error(`getAllBudgets failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getById(id: number): Promise<Budgets | null> {
    try {
      return await budgetRepository.getById(id);
    } catch (err: unknown) {
      logger.error(`getBudgetById failed [budgetId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async update(id: number, body: BudgetsInput): Promise<Budgets | null> {
    try {
      const existingBudget = await budgetRepository.getById(id);
      if (!existingBudget) return null;
      return await budgetRepository.update(id, body);
    } catch (err: unknown) {
      logger.error(`updateBudget failed [budgetId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async withdraw(id: number, amount: number): Promise<Budgets | null> {
    try {
      const existingBudget = await budgetRepository.getById(id);
      if (!existingBudget) return null;
      return await budgetRepository.withdraw(id, amount);
    } catch (err: unknown) {
      logger.error(`withdrawFromBudget failed [budgetId=${String(id)}, amount=${String(amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default budgetService;
