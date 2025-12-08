import { dbPool } from "../../database/db";
import { Budgets, BudgetsInput, tables } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";

export const budgetRepository = {
  async create(budget: BudgetsInput): Promise<Budgets> {
    try {
      const res = await dbPool.query<Budgets>(
        `INSERT INTO ${tables.budgets.tableName} 
          (name, theme, amount, maximum_spending, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [budget.name, budget.theme, budget.amount, budget.maximum_spending]
      );
      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`create budget failed [name=${budget.name}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async delete(id: number): Promise<Budgets> {
    try {
      const res = await dbPool.query<Budgets>(
        `UPDATE ${tables.budgets.tableName} 
         SET deleted_at = NOW(), updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`softDelete failed [budgetId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deposit(id: number, amount: number): Promise<Budgets | null> {
    try {
      const res = await dbPool.query<Budgets>(
        `UPDATE ${tables.budgets.tableName}
         SET maximum_spending = maximum_spending + $1, updated_at = NOW()
         WHERE id = $2 AND deleted_at IS NULL
         RETURNING *`,
        [amount, id]
      );
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`deposit failed [budgetId=${String(id)}, amount=${String(amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async get(): Promise<Budgets[]> {
    try {
      const res = await dbPool.query<Budgets>(`SELECT * FROM ${tables.budgets.tableName} WHERE deleted_at IS NULL ORDER BY id ASC`);
      return res.rows;
    } catch (err: unknown) {
      logger.error(`findAll budgets failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getById(id: number): Promise<Budgets | null> {
    try {
      const res = await dbPool.query<Budgets>(`SELECT * FROM ${tables.budgets.tableName} WHERE id = $1 AND deleted_at IS NULL`, [id]);
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`findById failed [budgetId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async update(id: number, budget: BudgetsInput): Promise<Budgets> {
    try {
      const existing = await this.getById(id);
      if (!existing) throw new Error("Budget not found");

      const updatedBudget = { ...existing, ...budget };

      const res = await dbPool.query<Budgets>(
        `UPDATE ${tables.budgets.tableName} 
         SET name = $1, theme = $2, amount = $3, maximum_spending = $4, updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [updatedBudget.name, updatedBudget.theme, updatedBudget.amount, updatedBudget.maximum_spending, id]
      );
      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`update budget failed [budgetId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async withdraw(id: number, amount: number): Promise<Budgets | null> {
    try {
      const res = await dbPool.query<Budgets>(
        `UPDATE ${tables.budgets.tableName}
         SET maximum_spending = maximum_spending - $1, updated_at = NOW()
         WHERE id = $2 AND deleted_at IS NULL AND maximum_spending >= $1
         RETURNING *`,
        [amount, id]
      );
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`withdraw failed [budgetId=${String(id)}, amount=${String(amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default budgetRepository;
