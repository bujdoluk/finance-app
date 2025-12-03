import { Resource } from "../utils/jsonapi/resource";
import { User, UserCreateBody, UserUpdateBody } from "./index";
import mapToUserResource from "./mapper";
import userRepository from "./repository";

export const userService = {
  createUser(body: UserCreateBody): Resource {
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
  },

  deleteUser(id: number): null | Resource {
    const user = userRepository.findById(id);
    if (!user) return null;

    user.deleted_at = true;
    user.updated_at = new Date().toISOString();
    userRepository.softDelete(user);

    return mapToUserResource(user);
  },

  getAllUsers(): Resource[] {
    return userRepository.findAll().map(mapToUserResource);
  },

  getUserById(id: number): null | Resource {
    const user = userRepository.findById(id);
    return user ? mapToUserResource(user) : null;
  },

  updateUser(id: number, body: UserUpdateBody): null | Resource {
    const user = userRepository.findById(id);
    if (!user) return null;

    if (body.first_name !== undefined) user.first_name = body.first_name;
    if (body.last_name !== undefined) user.last_name = body.last_name;
    if (body.email !== undefined) user.email = body.email;
    if (body.password !== undefined) user.password = body.password;

    user.updated_at = new Date().toISOString();
    userRepository.update(user);

    return mapToUserResource(user);
  },
};

export default userService;
