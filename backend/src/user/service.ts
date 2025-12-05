import { Resource } from "../utils/jsonapi/resource";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { User, UserCreateBody, UserUpdateBody } from "./index";
import mapToUserResource from "./mapper";
import userRepository from "./repository";

export const userService = {
  async createUser(body: UserCreateBody): Promise<Resource> {
    try {
      const newUser: Partial<User> = {
        ...body,
        created_at: new Date().toISOString(),
        deleted_at: false,
        updated_at: new Date().toISOString(),
      };

      const stored = await userRepository.create(newUser);
      return mapToUserResource(stored);
    } catch (err: unknown) {
      logger.error(`createUser error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deleteUser(id: number): Promise<null | Resource> {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        logger.warn(`deleteUser: User not found [userId=${String(id)}]`);
        return null;
      }

      const deletedUser = await userRepository.softDelete(id);
      return mapToUserResource(deletedUser);
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
      if (!user) {
        logger.warn(`getUserById: User not found [userId=${String(id)}]`);
        return null;
      }
      return mapToUserResource(user);
    } catch (err: unknown) {
      logger.error(`getUserById error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async updateUser(id: number, body: UserUpdateBody): Promise<null | Resource> {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        logger.warn(`updateUser: User not found [userId=${String(id)}]`);
        return null;
      }

      const updatedUserData: User = {
        ...user,
        email: body.email ?? user.email,
        first_name: body.first_name ?? user.first_name,
        last_name: body.last_name ?? user.last_name,
        password: body.password ?? user.password,
        updated_at: new Date().toISOString(),
      };

      const updatedUser = await userRepository.update(updatedUserData);
      return mapToUserResource(updatedUser);
    } catch (err: unknown) {
      logger.error(`updateUser error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default userService;
