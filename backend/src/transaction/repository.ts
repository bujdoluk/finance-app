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

  async findAll(): Promise<Transactions[]> {
    try {
      const res = await dbPool.query<Transactions>(
        `SELECT * FROM ${tables.transactions.tableName} WHERE deleted_at IS NULL ORDER BY id ASC`
      );
      return res.rows;
    } catch (err: unknown) {
      logger.error(`findAll failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async findById(id: number): Promise<null | Transactions> {
    try {
      const res = await dbPool.query<Transactions>(
        `SELECT * FROM ${tables.transactions.tableName} WHERE id = $1 AND deleted_at IS NULL`,
        [id]
      );
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`findById failed [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async softDelete(id: number): Promise<Transactions> {
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
};

export default transactionRepository;
