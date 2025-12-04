import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createError, createErrorDocument, joiToErrors } from "../utils/jsonapi/error";
import logger, { formatValidationMessage, getErrorMessage } from "../utils/logger/logger";
import { UserCreateBody, UserUpdateBody } from "./index";
import userService from "./service";
import { createUserSchema, updateUserSchema } from "./validation";

export const getAllUsers = (_req: Request, res: Response) => {
  try {
    const users = userService.getAllUsers();
    return res.json(users);
  } catch (err: unknown) {
    logger.error(`getAllUsers error: ${getErrorMessage(err)}`);
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
    const userId = Number(req.params.id);
    const user = userService.getUserById(userId);

    if (!user) {
      logger.warn(`getUserById: User not found [userId=${String(userId)}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "User not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json(user);
  } catch (err: unknown) {
    logger.error(`getUserById error [userId=${req.params.id}]: ${getErrorMessage(err)}`);
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
      const messages = validation.error.details
        .map(d => formatValidationMessage(d.message))
        .join(' ');
      logger.warn(`createUser validation failed. ${messages}`);
      return res.json(joiToErrors(validation.error.details, StatusCodes.BAD_REQUEST));
    }

    const user = userService.createUser(validation.value);
    return res.status(StatusCodes.CREATED).json({ message: "User created", user });
  } catch (err: unknown) {
    logger.error(`createUser error: ${getErrorMessage(err)}`);
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
    const userId = Number(req.params.id);
    const validation = updateUserSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const messages = validation.error.details
        .map(d => formatValidationMessage(d.message))
        .join(' ');
      logger.warn(`updateUser validation failed [userId=${String(userId)}]. ${messages}`);
      return res.json(joiToErrors(validation.error.details, StatusCodes.BAD_REQUEST));
    }

    const user = userService.updateUser(userId, validation.value);
    if (!user) {
      logger.warn(`updateUser: User not found [userId=${String(userId)}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "User not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "User updated", user });
  } catch (err: unknown) {
    logger.error(`updateUser error [userId=${req.params.id}]: ${getErrorMessage(err)}`);
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
    const userId = Number(req.params.id);
    const user = userService.deleteUser(userId);

    if (!user) {
      logger.warn(`deleteUser: User not found [userId=${String(userId)}]`);
      return res.json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "User not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "User soft deleted", user });
  } catch (err: unknown) {
    logger.error(`deleteUser error [userId=${req.params.id}]: ${getErrorMessage(err)}`);
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
