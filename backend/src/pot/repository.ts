import transactionRepository from "@/transaction/repository";
import { dbPool } from "../../database/db";
import { Pots, PotsInput, tables } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";

export const potRepository = {
  async create(data: PotsInput): Promise<Pots> {
    try {
      const res = await dbPool.query<Pots>(
        ` INSERT INTO ${tables.pots.tableName} (name, target, theme) 
          VALUES ($1, $2, $3) RETURNING *`,
        [data.name, data.target, data.theme]
      );
      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`create pot failed [name=${data.name}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deleteWithRefund(id: number): Promise<Pots | null> {
    try {
      await dbPool.query("BEGIN");
      const potRes = await dbPool.query<Pots>(
        ` SELECT * FROM ${tables.pots.tableName}
          WHERE id = $1 AND deleted_at IS NULL`,
        [id]
      );

      const pot = potRes.rows[0];
      if (!pot) return null;

      if (pot.total_saved > 0) {
        await transactionRepository.create({
          amount: pot.total_saved,
          category: pot.name, 
          transaction_type: "income",
          date: new Date(),
          sender: pot.name,
        });
      }

      const deleteRes = await dbPool.query<Pots>(
        ` UPDATE ${tables.pots.tableName}
          SET deleted_at = NOW()
          WHERE id = $1
          RETURNING *`,
        [id]
      );

      await dbPool.query("COMMIT");
      return deleteRes.rows[0];
    } catch (err: unknown) {
      await dbPool.query("ROLLBACK");
      throw err;
    }
  },

  async get(query?: Record<string, unknown>): Promise<{ rows: Pots[], total: number }> {
    try {
      await dbPool.query('BEGIN');

      let where = "deleted_at IS NULL";
      const params: unknown[] = [];

      const allowedFields = ["id", "name", "theme", "target", "amount", "total_saved"];

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
      let limit: number | undefined;
      let offset: number | undefined;

      if (query) {
        if (query['page[limit]'] !== undefined) {
          limit = Number(query['page[limit]']);
          if (isNaN(limit) || limit <= 0) limit = undefined;
        }
        if (query['page[offset]'] !== undefined) {
          offset = Number(query['page[offset]']);
          if (isNaN(offset) || offset < 0) offset = undefined;
        }
      }

      let data = `SELECT * FROM ${tables.pots.tableName} WHERE ${where} ${orderBy}`;
      const count = `SELECT COUNT(*)::int AS total FROM ${tables.pots.tableName} WHERE ${where}`;

      if (limit !== undefined && offset !== undefined) {
        params.push(limit, offset);
        data += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;
      }

      const [dataRes, countRes] = await Promise.all([
        dbPool.query<Pots>(data, params),
        dbPool.query<{ total: number }>(count, params.slice(0, params.length - 2)),
      ]);

      await dbPool.query('COMMIT');

      return {
        rows: dataRes.rows,
        total: countRes.rows[0].total,
      };
    } catch (err: unknown) {
      await dbPool.query('ROLLBACK');
      logger.error(`findAll pots failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getById(id: number): Promise<null | Pots> {
    try {
      const res = await dbPool.query<Pots>(
        ` SELECT * FROM ${tables.pots.tableName} 
          WHERE id = $1 AND deleted_at IS NULL`, [id]
      );
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`findById pot failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async updateTotalSaved(id: number, data: PotsInput): Promise<null | Pots> {
    try {
      const res = await dbPool.query<Pots>(
        ` UPDATE ${tables.pots.tableName} SET amount = $1, updated_at = NOW()
          WHERE id = $2 AND deleted_at IS NULL RETURNING *`, [data.total_saved, id]
      );
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`Update pot failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deposit(id: number, amount: number): Promise<Pots | null> {
    try {
      await dbPool.query("BEGIN");
      const potRes = await dbPool.query<Pots>(
        ` UPDATE ${tables.pots.tableName}
          SET total_saved = total_saved + $1, updated_at = NOW()
          WHERE id = $2 AND deleted_at IS NULL
          RETURNING *`,
        [amount, id]
      );

      const pot = potRes.rows[0];
      if (!pot) throw new Error("Pot not found");

      await transactionRepository.create({
        amount,
        category: pot.name,
        transaction_type: "expense",
        date: new Date(),
        sender: pot.name,
      });

      await dbPool.query("COMMIT");
      return pot;
    } catch (err: unknown) {
      await dbPool.query("ROLLBACK");
      logger.error(`pot deposit failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

   async withdraw(id: number, amount: number): Promise<Pots | null> {
     try {
      await dbPool.query("BEGIN");
      const potRes = await dbPool.query<Pots>(
        ` UPDATE ${tables.pots.tableName}
          SET total_saved = total_saved - $1, updated_at = NOW()
          WHERE id = $2 AND deleted_at IS NULL AND total_saved >= $1
          RETURNING *`,
        [amount, id]
      );

      const pot = potRes.rows[0];
      if (!pot) throw new Error("Insufficient funds or pot not found");

      await transactionRepository.create({
        amount,
        category: pot.name,
        transaction_type: "income",
        date: new Date(),
        sender: pot.name,
      });

      await dbPool.query("COMMIT");
      return pot;
    } catch (err: unknown) {
      await dbPool.query("ROLLBACK");
      logger.error(`pot withdraw failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default potRepository;
