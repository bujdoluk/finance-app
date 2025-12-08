import { Filters } from "@/utils/parseFilters";

import { dbPool } from "../../database/db";
import { tables, Transactions, TransactionsInput } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";

export const transactionRepository = {
  async create(transaction: TransactionsInput): Promise<Transactions> {
    try {
      const res = await dbPool.query<Transactions>(
        `INSERT INTO ${tables.transactions.tableName} 
          (amount, category, date, sender, sender_picture, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        [
          transaction.amount,
          transaction.category,
          transaction.date,
          transaction.sender,
          transaction.sender_picture,
        ]
      );

      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`create failed: ${getErrorMessage(err)}`);
      throw err; 
    }
  },

  async delete(id: number): Promise<Transactions> {
    try {
      const res = await dbPool.query<Transactions>(
        `UPDATE ${tables.transactions.tableName}
         SET deleted_at = NOW(), updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`softDelete failed [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async findFilteredOrSortedTransactions(filter: Filters | null, sort?: string): Promise<Transactions[]> {
    try {
      let where = "deleted_at IS NULL";
      const params: unknown[] = [];
      const allowedFields = ["amount", "category", "date", "sender", "created_at"];

      if (filter) {
        if (!allowedFields.includes(filter.field)) {
          throw new Error(`Invalid filter field: ${filter.field}`);
        }

        const paramIndex = params.length + 1; 

        switch (filter.type) {
          case "contains":
            where += ` AND ${filter.field} ILIKE $${String(paramIndex)}`;
            params.push(`%${filter.value}%`);
            break;

          case "equals":
            where += ` AND ${filter.field} = $${String(paramIndex)}`;
            params.push(filter.value);
            break;

          case "greaterThan":
            where += ` AND ${filter.field} > $${String(paramIndex)}`;
            params.push(filter.value);
            break;

          case "lessThan":
            where += ` AND ${filter.field} < $${String(paramIndex)}`;
            params.push(filter.value);
            break;
        }
      }

      const validSortFields = ["id", "amount", "category", "date", "created_at"];
      let orderBy = "ORDER BY id ASC";

      if (sort) {
        const isDesc = sort.startsWith("-");
        const field = isDesc ? sort.substring(1) : sort;

        if (!validSortFields.includes(field)) {
          throw new Error(`Invalid sort field: ${field}`);
        }

        orderBy = `ORDER BY ${field} ${isDesc ? "DESC" : "ASC"}`;
      }
      const sql = `SELECT * FROM ${tables.transactions.tableName} WHERE ${where} ${orderBy}`;
      const res = await dbPool.query<Transactions>(sql, params);
      return res.rows;
    } catch (err: unknown) {
      logger.error(`findFilteredAndSorted error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async get(): Promise<Transactions[]> {
    try {
      const res = await dbPool.query<Transactions>(
        `SELECT * FROM ${tables.transactions.tableName}
         WHERE deleted_at IS NULL
         ORDER BY id ASC`
      );

      return res.rows;
    } catch (err: unknown) {
      logger.error(`findAll failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getById(id: number): Promise<null | Transactions> {
    try {
      const res = await dbPool.query<Transactions>(
        `SELECT * FROM ${tables.transactions.tableName}
         WHERE id = $1 AND deleted_at IS NULL`,
        [id]
      );

      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`findById failed [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default transactionRepository;
