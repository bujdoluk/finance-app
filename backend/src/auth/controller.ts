import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createError, createErrorDocument } from "../utils/jsonapi/error";
import logger, { getErrorMessage } from "../utils/logger/logger";
import authService from "./service";

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await authService.signUp(req.body);
    return res.status(StatusCodes.CREATED).json({ message: "User created", user });
  } catch (err: unknown) {
    logger.error(`signUp error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.BAD_REQUEST).json(
      createErrorDocument([
        createError(
          StatusCodes.BAD_REQUEST,
          "Bad Request",
          getErrorMessage(err)
        ),
      ])
    );
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token = await authService.login(req.body.email, req.body.password);
    return res.json({ message: "Login successful", token });
  } catch (err: unknown) {
    logger.warn(`Login failed: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.UNAUTHORIZED).json(
      createErrorDocument([
        createError(
          StatusCodes.UNAUTHORIZED,
          "Unauthorized",
          "Invalid email or password"
        ),
      ])
    );
  }
};
