

import { dbPool } from "../../database/db";
import { tables, Users, UsersInput  } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";


export const userRepository = {
  async create(user: UsersInput): Promise<Users> {
    try {
      const res = await dbPool.query<Users>(
        `INSERT INTO ${tables.users.tableName} (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
        [user.first_name, user.last_name, user.email, user.password]
      );
      const createdUser = res.rows[0];
      return createdUser;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`create user failed [email=${user.email}]: ${message}`);
      throw err;
    }
  },

  async findAll(): Promise<Users[]> {
    try {
      const res = await dbPool.query<Users>(`SELECT * FROM ${tables.users.tableName} WHERE deleted_at IS NULL ORDER BY id ASC`);
      return res.rows;
    } catch (err: unknown) {
      logger.error(`findAll users failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async findById(id: number): Promise<null | Users> {
    try {
      const res = await dbPool.query<Users>(`SELECT * FROM ${tables.users.tableName} WHERE id = $1 AND deleted_at IS NULL`, [id]);
      return res.rows[0] ?? null;
    } catch (err: unknown) {
      logger.error(`findById failed [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async softDelete(id: number): Promise<Users> {
    try {
      const res = await dbPool.query<Users>(`UPDATE ${tables.users.tableName} SET deleted_at = NOW() WHERE id = $1 RETURNING *`, [id]);
      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`softDelete failed [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async update(id: number, body: UsersInput): Promise<Users> {
    try {
      const res = await dbPool.query<Users>(
        `UPDATE ${tables.users.tableName}
         SET first_name = $1,
             last_name = $2,
             email = $3,
             password = $4,
             updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [body.first_name, body.last_name, body.email, body.password, id]
      );
      return res.rows[0];
    } catch (err: unknown) {
      logger.error(`update failed [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default userRepository;
