import { db } from "../../database/db";
import { User } from "./index";

export const userRepository = {
  async create(
    data: Omit<User, "created_at" | "id" | "updated_at">
  ): Promise<User> {
    try {
      const result = await db<User>("users")
        .insert({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .returning("*");

      return result[0];
    } catch (error) {
      console.error(`Error creating user: ${String(error)}`);
      throw error;
    }
  },

  async findAll(): Promise<User[]> {
    try {
      const result = await db<User>("users")
        .select("*")
        .where("deleted_at", false);

      return result;
    } catch (error) {
      console.error(`Error fetching users: ${String(error)}`);
      throw error;
    }
  },

  async findById(id: number): Promise<undefined | User> {
    try {
      const result = await db<User>("users")
        .select("*")
        .where({ deleted_at: false, id })
        .first();

      return result;
    } catch (error) {
      console.error(`Error fetching user id=${String(id)}: ${String(error)}`);
      throw error;
    }
  },

  async softDelete(id: number): Promise<undefined | User> {
    try {
      const result = await db<User>("users")
        .update({
          deleted_at: true,
          updated_at: new Date().toISOString(),
        })
        .where({ id })
        .returning("*");

      return result[0];
    } catch (error) {
      console.error(`Error soft-deleting user id=${String(id)}: ${String(error)}`);
      throw error;
    }
  },

  async update(id: number, data: Partial<User>): Promise<undefined | User> {
    try {
      const result = await db<User>("users")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .where({ deleted_at: false, id })
        .returning("*");

      return result[0];
    } catch (error) {
      console.error(`Error updating user id=${String(id)}: ${String(error)}`);
      throw error;
    }
  },
};

export default userRepository;
