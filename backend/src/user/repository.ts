import { User } from "./index";

export const users: User[] = [];

export const userRepository = {
  create(user: User): User {
    users.push(user);
    return user;
  },

  findAll(): User[] {
    return users.filter(u => !u.deleted_at);
  },

  findById(id: number): undefined | User {
    return users.find(u => u.id === id && !u.deleted_at);
  },

  softDelete(user: User): User {
    return user;
  },

  update(user: User): User {
    return user;
  },
};

export default userRepository;
