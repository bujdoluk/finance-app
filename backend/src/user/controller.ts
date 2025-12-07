import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Users, UsersInput } from "../../database/dbSchema";
import { createError, createErrorDocument, joiToErrors } from "../utils/jsonapi/error";
import logger, { formatValidationMessage, getErrorMessage } from "../utils/logger/logger";
import { mapToUserResource } from "./mapper";
import userService from "./service";
import { createUserSchema, updateUserSchema } from "./validation";

export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users: Users[] = await userService.getAllUsers();
    return res.json(users.map(mapToUserResource));
  } catch (err: unknown) {
    logger.error(`getAllUsers error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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

export const getUserById = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.params.id);
    const user: null | Users = await userService.getUserById(userId);

    if (!user) {
      logger.warn(`getUserById: User not found [userId=${String(userId)}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "User not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json(mapToUserResource(user));
  } catch (err: unknown) {
    logger.error(`getUserById error [userId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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

export const createUser = async (req: Request<unknown, unknown, UsersInput>, res: Response): Promise<Response> => {
  try {
    const validation = createUserSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const messages = validation.error.details.map(d => formatValidationMessage(d.message)).join(" ");
      logger.warn(`createUser validation failed. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(joiToErrors(validation.error.details, StatusCodes.BAD_REQUEST));
    }

    const user: Users = await userService.createUser(validation.value);
    return res.status(StatusCodes.CREATED).json({ message: "User created", user: mapToUserResource(user) });
  } catch (err: unknown) {
    logger.error(`createUser error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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

export const updateUser = async (req: Request<{ id: string }, unknown, UsersInput>, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.params.id);
    const validation = updateUserSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const messages = validation.error.details.map(d => formatValidationMessage(d.message)).join(" ");
      logger.warn(`updateUser validation failed [userId=${String(userId)}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(joiToErrors(validation.error.details, StatusCodes.BAD_REQUEST));
    }

    const user: null | Users = await userService.updateUser(userId, validation.value);
    if (!user) {
      logger.warn(`updateUser: User not found [userId=${String(userId)}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "User not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "User updated", user: mapToUserResource(user) });
  } catch (err: unknown) {
    logger.error(`updateUser error [userId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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

export const deleteUser = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.params.id);
    const user: null | Users = await userService.deleteUser(userId);

    if (!user) {
      logger.warn(`deleteUser: User not found [userId=${String(userId)}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "User not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "User soft deleted", user: mapToUserResource(user) });
  } catch (err: unknown) {
    logger.error(`deleteUser error [userId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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
