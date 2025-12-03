import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createError, createErrorDocument, joiToErrors } from "../utils/jsonapi/error";
import { UserCreateBody, UserUpdateBody } from "./index";
import userService from "./service";
import { createUserSchema, updateUserSchema } from "./validation";

export const getAllUsers = (_req: Request, res: Response) => {
  try {
    const users = userService.getAllUsers();
    return res.json(users);
  } catch (err) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          err instanceof Error ? err.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const getUserById = (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = userService.getUserById(Number(req.params.id));
    if (!user) {
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "User not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json(user);
  } catch (err) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          err instanceof Error ? err.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const createUser = (req: Request<unknown, unknown, UserCreateBody>, res: Response) => {
  try {
    const validation = createUserSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      return res.json(joiToErrors(validation.error.details, StatusCodes.BAD_REQUEST));
    }

    const user = userService.createUser(validation.value);
    return res.status(StatusCodes.CREATED).json({ message: "User created", user });
  } catch (err) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          err instanceof Error ? err.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const updateUser = (req: Request<{ id: string }, unknown, UserUpdateBody>, res: Response) => {
  try {
    const validation = updateUserSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      return res.json(joiToErrors(validation.error.details, StatusCodes.BAD_REQUEST));
    }

    const user = userService.updateUser(Number(req.params.id), validation.value);
    if (!user) {
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "User not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "User updated", user });
  } catch (err) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          err instanceof Error ? err.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const deleteUser = (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = userService.deleteUser(Number(req.params.id));
    if (!user) {
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "User not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json({ message: "User soft deleted", user });
  } catch (err) {
    return res.json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          err instanceof Error ? err.message : "Something went wrong"
        ),
      ])
    );
  }
};
