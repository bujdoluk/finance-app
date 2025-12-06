import { QueryResult } from "pg";

import pool from "../../database/db";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { User } from "./index";
import { mapDbUser } from "./mapper";

export const userRepository = {
  async create(user: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }): Promise<User> {
    try {
      const res: QueryResult<User> = await pool.query<User>(
        `INSERT INTO users (first_name, last_name, email, password)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user.first_name, user.last_name, user.email, user.password]
      );

      const [createdUser] = mapDbUser(res);
      logger.info(`User created [userId=${String(createdUser.id)}]`);
      return createdUser;
    } catch (err: unknown) {
      logger.error(
        `create user failed [email=${user.email}]: ${getErrorMessage(err)}`
      );
      throw err;
    }
  },

  async findAll(): Promise<User[]> {
    try {
      const res: QueryResult<User> = await pool.query<User>(
        `SELECT * FROM users WHERE deleted_at IS NULL ORDER BY id ASC`
      );
      return mapDbUser(res);
    } catch (err: unknown) {
      logger.error(`findAll users failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async findById(id: number): Promise<null | User> {
    try {
      const res: QueryResult<User> = await pool.query<User>(
        `SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`,
        [id]
      );

      const [user] = mapDbUser(res);
      return user ?? null;
    } catch (err: unknown) {
      logger.error(
        `findById failed [userId=${String(id)}]: ${getErrorMessage(err)}`
      );
      throw err;
    }
  },

  async softDelete(id: number): Promise<User> {
    try {
      const res: QueryResult<User> = await pool.query<User>(
        `UPDATE users
         SET deleted_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      const [deletedUser] = mapDbUser(res);
      logger.info(`User soft deleted [userId=${String(id)}]`);
      return deletedUser;
    } catch (err: unknown) {
      logger.error(
        `softDelete failed [userId=${String(id)}]: ${getErrorMessage(err)}`
      );
      throw err;
    }
  },

  async update(id: number, body: Partial<User>): Promise<User> {
    try {
      const res: QueryResult<User> = await pool.query<User>(
        `UPDATE users
         SET first_name = $1,
             last_name = $2,
             email = $3,
             password = $4,
             updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [body.first_name, body.last_name, body.email, body.password, id]
      );

      const [updatedUser] = mapDbUser(res);
      logger.info(`User updated [userId=${String(id)}]`);
      return updatedUser;
    } catch (err: unknown) {
      logger.error(
        `update failed [userId=${String(id)}]: ${getErrorMessage(err)}`
      );
      throw err;
    }
  },
};

export default userRepository;
