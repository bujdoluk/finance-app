import { dbPool } from "../../database/db";
import { Bills, BillsInput, tables } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";

export const billRepository = {
  async create(bill: BillsInput): Promise<Bills> {
    try {
      const res = await dbPool.query<Bills>(
        `INSERT INTO ${tables.bills.tableName} (name, amount, frequency, next_run, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
        [bill.name, bill.amount, bill.frequency ?? null, bill.next_run]
      );
      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`create bill failed [name=${bill.name}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async delete(id: number): Promise<Bills> {
    try {
      const res = await dbPool.query<Bills>(
        `UPDATE ${tables.bills.tableName}
         SET deleted_at = NOW(), updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`delete failed [billId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async get(): Promise<Bills[]> {
    try {
      const res = await dbPool.query<Bills>(`SELECT * FROM ${tables.bills.tableName} WHERE deleted_at IS NULL ORDER BY id ASC`);
      return res.rows;
    } catch (err: unknown) {
      logger.error(`findAll bills failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getById(id: number): Promise<Bills | null> {
    try {
      const res = await dbPool.query<Bills>(`SELECT * FROM ${tables.bills.tableName} WHERE id = $1 AND deleted_at IS NULL`, [id]);
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`findById failed [billId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async update(id: number, bill: BillsInput): Promise<Bills> {
    try {
      const res = await dbPool.query<Bills>(
        `UPDATE ${tables.bills.tableName}
         SET name = $1, amount = $2, frequency = $3, next_run = $4, updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [bill.name, bill.amount, bill.frequency ?? null, bill.next_run, id]
      );
      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`update bill failed [billId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default billRepository;
