import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Users, UsersInput } from "../../database/dbSchema";
import { userRepository } from "../user/repository";

const SALT_ROUNDS = 12;

export type AuthUser = {
  first_name: string;
  last_name: string;
  email: string;
  id: string;
};

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const user = await userRepository.getByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY not set");
    }

    const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    const safeUser: AuthUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      id: String(user.id),
    };

    return { token, user: safeUser };
  },

  async signUp(body: UsersInput): Promise<Users> {
    if (!body.password) throw new Error("Password is required");

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

    const userToCreate: UsersInput = {
      ...body,
      password: hashedPassword,
    };

    const createdUser = await userRepository.create(userToCreate);
    return createdUser;
  },
};

export default authService;
