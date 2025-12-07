import { dbPool } from "../../database/db";
import { Pots, PotsInput, tables } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";

export const potRepository = {
  async create(data: PotsInput): Promise<Pots> {
    try {
      const res = await dbPool.query<Pots>(`INSERT INTO ${tables.pots.tableName} (name, target, total_saved) VALUES ($1, $2, $3) RETURNING *`,
      [data.name, data.target, data.total_saved]);
      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`create pot failed [name=${data.name}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async findAll(): Promise<Pots[]> {
    try {
      const res = await dbPool.query<Pots>(`SELECT * FROM ${tables.pots.tableName} WHERE deleted_at IS NULL ORDER BY id ASC`);
      return res.rows;
    } catch (err: unknown) {
      logger.error(`findAll pots failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async findById(id: number): Promise<null | Pots> {
    try {
      const res = await dbPool.query<Pots>(`SELECT * FROM ${tables.pots.tableName} WHERE id = $1 AND deleted_at IS NULL`, [id]);
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`findById pot failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async softDelete(id: number): Promise<null | Pots> {
    try {
      const res = await dbPool.query<Pots>(`UPDATE ${tables.pots.tableName} SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *`, [id]);
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`softDelete pot failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async update(id: number, data: PotsInput): Promise<null | Pots> {
    try {
      const res = await dbPool.query<Pots>(`UPDATE ${tables.pots.tableName} SET name = $1, target = $2, total_saved = $3, updated_at = NOW()
      WHERE id = $4 AND deleted_at IS NULL RETURNING *`, [data.name, data.target, data.total_saved, id]);
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`update pot failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default potRepository;
