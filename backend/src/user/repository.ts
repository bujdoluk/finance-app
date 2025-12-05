import { Pool } from "pg";

import logger, { getErrorMessage } from "../utils/logger/logger";
import { User } from "./index";

const pool = new Pool({
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
});

export const userRepository = {
  async create(user: Partial<User>): Promise<User> {
    try {
      const { rows } = await pool.query<User>(
        `INSERT INTO users (first_name, last_name, email, password, deleted_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [user.first_name, user.last_name, user.email, user.password, false, new Date().toISOString(), new Date().toISOString()]
      );

      const createdUser = rows[0];

      logger.info(`User created [userId=${String(createdUser.id)}]`);
      return createdUser;
    } catch (err: unknown) {
      logger.error(`create user failed [email=${String(user.email)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async findAll(): Promise<User[]> {
    try {
      const { rows } = await pool.query<User>(
        `SELECT * FROM users WHERE deleted_at = false ORDER BY id ASC`
      );
      return rows;
    } catch (err: unknown) {
      logger.error(`findAll users failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async findById(id: number): Promise<null | User> {
    try {
      const { rows } = await pool.query<User>(
        `SELECT * FROM users WHERE id = $1 AND deleted_at = false`,
        [id]
      );
      return rows[0] || null;
    } catch (err: unknown) {
      logger.error(`findById failed [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async softDelete(id: number): Promise<User> {
    try {
      const { rows } = await pool.query<User>(
        `UPDATE users SET deleted_at = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      const deletedUser = rows[0];
      logger.info(`User soft deleted [userId=${String(id)}]`);
      return deletedUser;
    } catch (err: unknown) {
      logger.error(`softDelete failed [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async update(user: User): Promise<User> {
    try {
      const { rows } = await pool.query<User>(
        `UPDATE users 
         SET first_name = $1, last_name = $2, email = $3, password = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 RETURNING *`,
        [user.first_name, user.last_name, user.email, user.password, user.id]
      );
      const updatedUser = rows[0];
      logger.info(`User updated [userId=${String(user.id)}]`);
      return updatedUser;
    } catch (err: unknown) {
      logger.error(`update failed [userId=${String(user.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default userRepository;
