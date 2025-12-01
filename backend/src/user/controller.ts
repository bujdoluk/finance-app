import  { Request, Response } from 'express';

import { User, UserCreateBody, users, UserUpdateBody } from "./index";

export const getAllUsers = (req: Request, res: Response) => {
  res.json(users.filter(u => !u.deleted_at));
};

export const getUserById = (req: Request, res: Response) => {
  const user = users.find(u => u.id === Number(req.params.id) && !u.deleted_at);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const createUser = (req: Request<Record<string, string>, object, UserCreateBody>, res: Response) => {
  const { email, first_name, last_name, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newUser: User = {
    created_at: new Date().toISOString(),
    deleted_at: false,
    email,
    first_name,
    id: users.length ? users[users.length - 1].id + 1 : 1,
    last_name,
    password,
    updated_at: new Date().toISOString()
  };

  return res.status(201).json({ message: "User created", user: newUser });
};

export const updateUser = (req: Request<{ id: string }, object, UserUpdateBody>, res: Response) => {
  const user = users.find(u => u.id === Number(req.params.id) && !u.deleted_at);
  if (!user) return res.status(404).json({ message: "User not found" });

  const body = req.body;

  if (body.first_name !== undefined) user.first_name = body.first_name;
  if (body.last_name !== undefined) user.last_name = body.last_name;
  if (body.email !== undefined) user.email = body.email;
  if (body.password !== undefined) user.password = body.password;

  user.updated_at = new Date().toISOString();

  return res.json({ message: "User updated", user });
};

export const deleteUser = (req: Request, res: Response) => {
  const user = users.find(u => u.id === Number(req.params.id) && !u.deleted_at);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.deleted_at = true;
  user.updated_at = new Date().toISOString();
  res.json({ message: "User soft deleted", user });
};