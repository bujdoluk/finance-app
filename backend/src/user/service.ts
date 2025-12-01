import { User, UserCreateBody, UserUpdateBody } from "./index";
import mapToUserEntity from "./mapper";
import userRepository from "./repository";

export const userService = {
  createUser(body: UserCreateBody) {
    const newUser: User = {
      created_at: new Date().toISOString(),
      deleted_at: false,
      email: body.email,
      first_name: body.first_name,
      id: Date.now(), 
      last_name: body.last_name,
      password: body.password, 
      updated_at: new Date().toISOString()
    };

    const stored = userRepository.create(newUser);
    return mapToUserEntity(stored);
  },

  deleteUser(id: number) {
    const user = userRepository.findById(id);
    if (!user) return null;

    user.deleted_at = true;
    user.updated_at = new Date().toISOString();

    userRepository.softDelete(user);
    return mapToUserEntity(user);
  },

  getAllUsers() {
    return userRepository.findAll().map(mapToUserEntity);
  },

  getUserById(id: number) {
    const user = userRepository.findById(id);
    return user ? mapToUserEntity(user) : null;
  },

  updateUser(id: number, body: UserUpdateBody) {
    const user = userRepository.findById(id);
    if (!user) return null;

    if (body.first_name !== undefined) user.first_name = body.first_name;
    if (body.last_name !== undefined) user.last_name = body.last_name;
    if (body.email !== undefined) user.email = body.email;
    if (body.password !== undefined) user.password = body.password;

    user.updated_at = new Date().toISOString();

    userRepository.update(user);
    return mapToUserEntity(user);
  }
};

export default userService;
