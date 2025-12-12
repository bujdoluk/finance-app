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

  async get(query?: Record<string, unknown>): Promise<Bills[]> {
    try {
      let where = "deleted_at IS NULL";
      const params: unknown[] = [];

      const allowedFields = ["id", "amount", "name", "next_run", "frequency", "created_at"];

       // Sort
      let orderBy = "ORDER BY id ASC";

      if (query?.sort) {
        const sortValue = String(query.sort);
        const sortFields = sortValue.split(",").map((part) => part.trim());
        const sqlSortParts: string[] = [];

        for (const part of sortFields) {
          const isDesc = part.startsWith("-");
          const field = isDesc ? part.substring(1) : part;

          if (!allowedFields.includes(field)) {
            throw new Error(`Invalid sort field: "${field}"`);
          }

          sqlSortParts.push(`${field} ${isDesc ? "DESC" : "ASC"}`);
        }

        if (sqlSortParts.length > 0) {
          orderBy = `ORDER BY ${sqlSortParts.join(", ")}`;
        }
      }

      const sql = `SELECT * FROM ${tables.bills.tableName} WHERE ${where} ${orderBy}`;
      const res = await dbPool.query<Bills>(sql, params);
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
