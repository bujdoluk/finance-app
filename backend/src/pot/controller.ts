import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createError, createErrorDocument } from "../utils/jsonapi/error";
import { PotCreateBody, PotDepositWithdrawBody, PotUpdateBody } from "./index";
import { potService } from "./service";
import { 
  validateCreatePot, 
  validateDepositWithdraw, 
  validateUpdatePot 
} from "./validation";

export const getAllPots = (_req: Request, res: Response) => {
  try {
    const pots = potService.getAllPots();
    return res.json(pots);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const getPotById = (req: Request<{ id: string }>, res: Response) => {
  try {
    const pot = potService.getPotById(Number(req.params.id));
    if (!pot) {
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" }),
        ])
      );
    }
    return res.json(pot);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const createPot = (req: Request<unknown, unknown, PotCreateBody>, res: Response) => {
  try {
    const errorDoc = validateCreatePot(req.body);
    if (errorDoc) return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);

    const pot = potService.createPot(req.body);
    return res.status(StatusCodes.CREATED).json({ message: "Pot created", pot });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const updatePot = (req: Request<{ id: string }, unknown, PotUpdateBody>, res: Response) => {
  try {
    const errorDoc = validateUpdatePot(req.body);
    if (errorDoc) return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);

    const pot = potService.updatePot(Number(req.params.id), req.body);
    if (!pot) {
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "Pot updated", pot });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const deletePot = (req: Request<{ id: string }>, res: Response) => {
  try {
    const pot = potService.deletePot(Number(req.params.id));
    if (!pot) {
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "Pot soft deleted", pot });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const depositToPot = (req: Request<{ id: string }, unknown, PotDepositWithdrawBody>, res: Response) => {
  try {
    const errorDoc = validateDepositWithdraw(req.body);
    if (errorDoc) return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);

    const pot = potService.deposit(Number(req.params.id), req.body);
    if (!pot) {
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Pot not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ message: "Deposit successful", pot });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};

export const withdrawFromPot = (req: Request<{ id: string }, unknown, PotDepositWithdrawBody>, res: Response) => {
  try {
    const errorDoc = validateDepositWithdraw(req.body);
    if (errorDoc) return res.status(StatusCodes.BAD_REQUEST).json(errorDoc);

    const pot = potService.withdraw(Number(req.params.id), req.body);
    if (!pot) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        createErrorDocument([
          createError(
            StatusCodes.BAD_REQUEST,
            "Bad Request",
            "Insufficient funds or pot not found",
            { pointer: "/data/attributes/amount" }
          ),
        ])
      );
    }

    return res.json({ message: "Withdrawal successful", pot });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          e instanceof Error ? e.message : "Something went wrong"
        ),
      ])
    );
  }
};
