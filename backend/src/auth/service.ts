import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Users, UsersInput } from "../../database/dbSchema";
import { userRepository } from "../user/repository";

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

const authService = {
  async login(email: string, password: string): Promise<string> {
    const user = await userRepository.getByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    return jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
  },

  async signUp(body: UsersInput): Promise<Users> {
    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

    const user: UsersInput = {
      ...body,
      password: hashedPassword,
    };

    return await userRepository.create(user);
  },
};

export default authService;
