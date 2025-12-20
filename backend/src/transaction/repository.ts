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

  async createMany(transactions: TransactionsInput[]): Promise<Transactions[]> {
    if (transactions.length === 0) return [];

    const values: string[] = [];
    const params: unknown[] = [];

    transactions.forEach((transaction, index) => {
      const baseIndex = index * 5;
      values.push(
        `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, NOW(), NOW())`
      );

        params.push(
          transaction.amount,
          transaction.category,
          transaction.date,
          transaction.sender,
          transaction.sender_picture
        );
    });

    const sql = `
      INSERT INTO ${tables.transactions.tableName}
        (amount, category, date, sender, sender_picture, created_at, updated_at)
      VALUES ${values.join(',')}
      RETURNING *
    `;

    const res = await dbPool.query<Transactions>(sql, params);
    return res.rows;
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

  async getCategories(): Promise<string[]> {
    try {
      const sql = `
        SELECT DISTINCT category 
        FROM ${tables.transactions.tableName}
        WHERE deleted_at IS NULL
        ORDER BY category ASC
      `;

      const res = await dbPool.query<{ category: string }>(sql);
      return res.rows.map(r => r.category);
    } catch (err: unknown) {
      logger.error(`transactionRepository.getCategories error: ${getErrorMessage(err)}`);
      throw err; 
    }
  },

  async get(query?: Record<string, unknown>): Promise<{ rows: Transactions[], total: number }> {
    try {
      await dbPool.query('BEGIN');

      let where = "deleted_at IS NULL";
      const params: unknown[] = [];

      const allowedFields = ["id", "amount", "category", "date", "sender", "created_at"];

      // Filter
      const filterKeys = Object.keys(query ?? {}).filter((k) => k.startsWith("filter"));

      for (const key of filterKeys) {
        const match = key.match(/^filter(?:\[(.+?)\])?$/);

        if (!match) continue;
        const field = match[1]; 
        if (!field) continue; 

        if (!allowedFields.includes(field)) {
          throw new Error(`Invalid filter field: "${field}"`);
        }

        const value = query![key];
        if (value === undefined || value === null) continue;

        const paramIndex = params.length + 1;

        if (Array.isArray(value)) {
          const placeholders = value.map((_, i) => `$${paramIndex + i}`).join(", ");
          where += ` AND ${field} IN (${placeholders})`;
          params.push(...value);
        } else {
          where += ` AND ${field} = $${paramIndex}`;
          params.push(value);
        }
      }

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

      // Pagination 
      const limit = Number(query?.['page[limit]']);
      const offset = Number(query?.['page[offset]']);

      params.push(limit, offset);

      const data = `SELECT * FROM ${tables.transactions.tableName} WHERE ${where} ${orderBy} LIMIT $${params.length - 1} OFFSET $${params.length}`;
      const count = `SELECT COUNT(*)::int AS total FROM ${tables.transactions.tableName} WHERE ${where}`;

      const [dataRes, countRes] = await Promise.all([
        dbPool.query<Transactions>(data, params),
        dbPool.query<{ total: number }>(count, params.slice(0, params.length - 2)),
      ]);

      await dbPool.query('COMMIT');

      return {
        rows: dataRes.rows,
        total: countRes.rows[0].total,
      };
    } catch (err: unknown) {
      await dbPool.query('ROLLBACK');
      logger.error(`get error: ${getErrorMessage(err)}`);
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
