import { Resource } from "../utils/jsonapi/resource";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { User, UserCreateBody, UserUpdateBody } from "./index";
import mapToUserResource from "./mapper";
import userRepository from "./repository";

export const userService = {
  createUser(body: UserCreateBody): Resource {
    try {
      const allUsers = userRepository.findAll();
      const newId = allUsers.length ? allUsers[allUsers.length - 1].id + 1 : 1;

      const newUser: User = {
        ...body,
        created_at: new Date().toISOString(),
        deleted_at: false,
        id: newId,
        updated_at: new Date().toISOString(),
      };

      const stored = userRepository.create(newUser);
      return mapToUserResource(stored);
    } catch (err: unknown) {
      logger.error(`createUser error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  deleteUser(id: number): null | Resource {
    try {
      const user = userRepository.findById(id);
      if (!user) {
        logger.warn(`deleteUser: User not found [userId=${String(id)}]`);
        return null;
      }

      user.deleted_at = true;
      user.updated_at = new Date().toISOString();
      userRepository.softDelete(user);

      return mapToUserResource(user);
    } catch (err: unknown) {
      logger.error(`deleteUser error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getAllUsers(): Resource[] {
    try {
      return userRepository.findAll().map(mapToUserResource);
    } catch (err: unknown) {
      logger.error(`getAllUsers error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getUserById(id: number): null | Resource {
    try {
      const user = userRepository.findById(id);
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

  updateUser(id: number, body: UserUpdateBody): null | Resource {
    try {
      const user = userRepository.findById(id);
      if (!user) {
        logger.warn(`updateUser: User not found [userId=${String(id)}]`);
        return null;
      }

      if (body.first_name !== undefined) user.first_name = body.first_name;
      if (body.last_name !== undefined) user.last_name = body.last_name;
      if (body.email !== undefined) user.email = body.email;
      if (body.password !== undefined) user.password = body.password;

      user.updated_at = new Date().toISOString();
      userRepository.update(user);

      return mapToUserResource(user);
    } catch (err: unknown) {
      logger.error(`updateUser error [userId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default userService;
