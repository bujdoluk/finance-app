import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Users, UsersInput } from "../../database/dbSchema";
import { userRepository } from "../user/repository";

const SALT_ROUNDS = 12;

export const authService = {
  async login(email: string, password: string): Promise<string> {
    const user = await userRepository.getByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    let token;
    if (process.env.JWT_SECRET_KEY) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" }) as Buffer | string;
    }

    if (typeof token !== "string") {
      throw new Error("Failed to generate JWT token");
    }

    return token;
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
