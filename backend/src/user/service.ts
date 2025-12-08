import { Users, UsersInput } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { userRepository } from "./repository";

export const userService = {
  async create(body: UsersInput): Promise<Users> {
    try {
      return await userRepository.create(body);
    } catch (err: unknown) {
      logger.error(`createUser error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async delete(id: number): Promise<null | Users> {
    try {
      const user = await userRepository.getById(id);
      if (!user) return null;
      return await userRepository.delete(id);
    } catch (err: unknown) {
      logger.error(`deleteUser error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async get(): Promise<Users[]> {
    try {
      return await userRepository.get();
    } catch (err: unknown) {
      logger.error(`getAllUsers error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getById(id: number): Promise<null | Users> {
    try {
      return await userRepository.getById(id);
    } catch (err: unknown) {
      logger.error(`getUserById error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async updateUser(id: number, body: UsersInput): Promise<null | Users> {
    try {
      const existingUser = await userRepository.getById(id);
      if (!existingUser) return null;
      return await userRepository.update(id, { ...existingUser, ...body });
    } catch (err: unknown) {
      logger.error(`updateUser error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default userService;
