import { Users, UsersInput } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { userRepository } from "./repository";

export const userService = {
  async createUser(body: UsersInput): Promise<Users> {
    try {
      return await userRepository.create(body);
    } catch (err: unknown) {
      logger.error(`createUser error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deleteUser(id: number): Promise<null | Users> {
    try {
      const user = await userRepository.findById(id);
      if (!user) return null;
      return await userRepository.softDelete(id);
    } catch (err: unknown) {
      logger.error(`deleteUser error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getAllUsers(): Promise<Users[]> {
    try {
      return await userRepository.findAll();
    } catch (err: unknown) {
      logger.error(`getAllUsers error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getUserById(id: number): Promise<null | Users> {
    try {
      return await userRepository.findById(id);
    } catch (err: unknown) {
      logger.error(`getUserById error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async updateUser(id: number, body: UsersInput): Promise<null | Users> {
    try {
      const existingUser = await userRepository.findById(id);
      if (!existingUser) return null;
      return await userRepository.update(id, { ...existingUser, ...body });
    } catch (err: unknown) {
      logger.error(`updateUser error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default userService;
