import { Resource } from "../utils/jsonapi/resource";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { UserCreateBody, UserUpdateBody } from "./index";
import mapToUserResource from "./mapper";
import userRepository from "./repository";

export const userService = {
  async createUser(body: UserCreateBody): Promise<Resource> {
    try {
      const stored = await userRepository.create(body);
      return mapToUserResource(stored);
    } catch (err: unknown) {
      logger.error(`createUser error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deleteUser(id: number): Promise<null | Resource> {
    try {
      const user = await userRepository.findById(id);
      if (!user) return null;

      const deleted = await userRepository.softDelete(id);
      return mapToUserResource(deleted);
    } catch (err: unknown) {
      logger.error(`deleteUser error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getAllUsers(): Promise<Resource[]> {
    try {
      const users = await userRepository.findAll();
      return users.map(mapToUserResource);
    } catch (err: unknown) {
      logger.error(`getAllUsers error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getUserById(id: number): Promise<null | Resource> {
    try {
      const user = await userRepository.findById(id);
      return user ? mapToUserResource(user) : null;
    } catch (err: unknown) {
      logger.error(`getUserById error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async updateUser(id: number, body: UserUpdateBody): Promise<null | Resource> {
    try {
      const user = await userRepository.findById(id);
      if (!user) return null;

      const updated = await userRepository.update(id, {
        ...user,
        ...body,
      });

      return mapToUserResource(updated);
    } catch (err: unknown) {
      logger.error(`updateUser error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default userService;
