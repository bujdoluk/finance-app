import { User, UserCreateBody, users, UserUpdateBody } from "./index";

const userService = {
  createUser: (data: UserCreateBody): User => {
    const newUser: User = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      ...data,
      created_at: new Date().toISOString(),
      deleted_at: false,
      updated_at: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },

  deleteUser: (id: number): undefined | User => {
    const user = users.find(u => u.id === id && !u.deleted_at);
    if (!user) return undefined;

    user.deleted_at = true;
    user.updated_at = new Date().toISOString();
    return user;
  },

  getAllUsers: (): User[] => {
    return users.filter(u => !u.deleted_at);
  },

  getUserById: (id: number): undefined | User => {
    return users.find(u => u.id === id && !u.deleted_at);
  },

  updateUser: (id: number, data: UserUpdateBody): undefined | User => {
    const user = users.find(u => u.id === id && !u.deleted_at);
    if (!user) return undefined;

    if (data.first_name !== undefined) user.first_name = data.first_name;
    if (data.last_name !== undefined) user.last_name = data.last_name;
    if (data.email !== undefined) user.email = data.email;
    if (data.password !== undefined) user.password = data.password;

    user.updated_at = new Date().toISOString();
    return user;
  },
};

export default userService;
