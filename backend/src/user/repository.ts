import logger, { getErrorMessage } from "../utils/logger/logger";
import { User } from "./index";

export const users: User[] = [];

export const userRepository = {
  create(user: User): User {
    try {
      users.push(user);
      logger.info(`User created [userId=${String(user.id)}]`);
      return user;
    } catch (err: unknown) {
      logger.error(`create user failed [userId=${String(user.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  findAll(): User[] {
    try {
      return users.filter(u => !u.deleted_at);
    } catch (err: unknown) {
      logger.error(`findAll users failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  findById(id: number): undefined | User {
    try {
      return users.find(u => u.id === id && !u.deleted_at);
    } catch (err: unknown) {
      logger.error(`findById failed [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  softDelete(user: User): User {
    try {
      logger.info(`User soft deleted [userId=${String(user.id)}]`);
      return user;
    } catch (err: unknown) {
      logger.error(`softDelete failed [userId=${String(user.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  update(user: User): User {
    try {
      logger.info(`User updated [userId=${String(user.id)}]`);
      return user;
    } catch (err: unknown) {
      logger.error(`update failed [userId=${String(user.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default userRepository;
