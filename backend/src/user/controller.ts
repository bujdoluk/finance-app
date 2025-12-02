import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { UserCreateBody, UserUpdateBody } from "./index";
import userService from "./service";
import { validateCreateUser, validateUpdateUser } from "./validation";

export const getAllUsers = (_req: Request, res: Response) => {
  return res.json(userService.getAllUsers());
};

export const getUserById = (req: Request, res: Response) => {
  const user = userService.getUserById(Number(req.params.id));
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });

  return res.json(user);
};

export const createUser = (
  req: Request<unknown, unknown, UserCreateBody>,
  res: Response
) => {
  const error = validateCreateUser(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const user = userService.createUser(req.body);
  return res.status(StatusCodes.CREATED).json({ message: "User created", user });
};

export const updateUser = (
  req: Request<{ id: string }, unknown, UserUpdateBody>,
  res: Response
) => {
  const error = validateUpdateUser(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  const user = userService.updateUser(Number(req.params.id), req.body);
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });

  return res.json({ message: "User updated", user });
};

export const deleteUser = (req: Request, res: Response) => {
  const user = userService.deleteUser(Number(req.params.id));
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });

  return res.json({ message: "User soft deleted", user });
};
