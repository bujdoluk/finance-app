import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  createError,
  createErrorDocument,
  joiToErrors,
} from "../utils/jsonapi/error";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { Bill } from "./index";
import billService, { BillCreateData } from "./service";
import { createBillSchema, updateBillSchema } from "./validation";

export const getAllBills = (_req: Request, res: Response) => {
  try {
    const bills = billService.getAllBills();
    return res.json(bills);
  } catch (err: unknown) {
    logger.error(`getAllBills error: ${getErrorMessage(err)}`);
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

export const getBillById = (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const bill = billService.getBillById(id);

    if (!bill) {
      logger.warn(`getBillById: Bill not found [billId=${String(id)}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Bill not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json(bill);
  } catch (err: unknown) {
    logger.error(`getBillById error [billId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const createBill = (req: Request<object, object, Partial<Bill>>, res: Response) => {
  try {
    const validation = createBillSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const messages = validation.error.details.map(d => d.message).join(" ");
      logger.warn(`createBill validation failed. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(joiToErrors(validation.error.details, StatusCodes.BAD_REQUEST));
    }

    const data = validation.value as BillCreateData;
    const bill = billService.createBill(data);

    return res.status(StatusCodes.CREATED).json({ bill, message: "Bill created" });
  } catch (err: unknown) {
    logger.error(`createBill error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const updateBill = (req: Request<{ id: string }, object, Partial<Bill>>, res: Response) => {
  try {
    const validation = updateBillSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const messages = validation.error.details.map(d => d.message).join(" ");
      logger.warn(`updateBill validation failed [billId=${req.params.id}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(joiToErrors(validation.error.details, StatusCodes.BAD_REQUEST));
    }

    const data = validation.value as Partial<Bill>;
    const bill = billService.updateBill(Number(req.params.id), data);

    if (!bill) {
      logger.warn(`updateBill: Bill not found [billId=${req.params.id}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Bill not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ bill, message: "Bill updated" });
  } catch (err: unknown) {
    logger.error(`updateBill error [billId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};

export const deleteBill = (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const bill = billService.deleteBill(id);

    if (!bill) {
      logger.warn(`deleteBill: Bill not found [billId=${String(id)}]`);
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(StatusCodes.NOT_FOUND, "Not Found", "Bill not found", { pointer: "/data/id" }),
        ])
      );
    }

    return res.json({ bill, message: "Bill soft deleted" });
  } catch (err: unknown) {
    logger.error(`deleteBill error [billId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([
        createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err instanceof Error ? err.message : "Something went wrong"),
      ])
    );
  }
};
