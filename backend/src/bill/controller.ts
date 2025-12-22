import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { BillsInput } from "../../database/dbSchema";
import { createError, createErrorDocument } from "../utils/jsonapi/error";
import logger, { getErrorMessage } from "../utils/logger/logger";
import mapToBillsResponse, { mapToBillResource } from "./mapper";
import billService from "./service";
import { createBillSchema, updateBillSchema } from "./validation";

export const getBills = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { rows, total } = await billService.get(req.query);
    return res.json(mapToBillsResponse(rows, total, req));
  } catch (err: unknown) {
    logger.error(`getBills error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", getErrorMessage(err))])
    );
  }
};

export const getBillById = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const bill = await billService.getById(id);
    if (!bill) {
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([createError(StatusCodes.NOT_FOUND, "Not Found", "Bill not found")])
      );
    }
    return res.json(mapToBillResource(bill));
  } catch (err: unknown) {
    logger.error(`getBillById error [billId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", getErrorMessage(err))])
    );
  }
};

export const createBill = async (req: Request<unknown, unknown, BillsInput>, res: Response): Promise<Response> => {
  try {
    const { error } = createBillSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map(d => d.message).join(" ");
      logger.warn(`createBill validation failed. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(
        createErrorDocument([createError(StatusCodes.BAD_REQUEST, "Validation Error", messages)])
      );
    }

    const value = req.body;

    const bill = await billService.create(value);
    return res.status(StatusCodes.CREATED).json({ bill: mapToBillResource(bill), message: "Bill created" });
  } catch (err: unknown) {
    logger.error(`createBill error: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", getErrorMessage(err))])
    );
  }
};

export const updateBill = async (req: Request<{ id: string }, unknown, BillsInput>, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);

    const { error } = updateBillSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(d => d.message).join(" ");
      logger.warn(`updateBill validation failed [billId=${String(id)}]. ${messages}`);
      return res.status(StatusCodes.BAD_REQUEST).json(
        createErrorDocument([createError(StatusCodes.BAD_REQUEST, "Validation Error", messages)])
      );
    }

    const value = req.body;

    const bill = await billService.update(id, value);
    if (!bill) {
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([createError(StatusCodes.NOT_FOUND, "Not Found", "Bill not found")])
      );
    }

    return res.json({ bill: mapToBillResource(bill), message: "Bill updated" });
  } catch (err: unknown) {
    logger.error(`updateBill error [billId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", getErrorMessage(err))])
    );
  }
};

export const deleteBill = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const bill = await billService.delete(id);
    if (!bill) {
      return res.status(StatusCodes.NOT_FOUND).json(createErrorDocument([createError(StatusCodes.NOT_FOUND, "Not Found", "Bill not found")]));
    }

    return res.json({ bill: mapToBillResource(bill), message: "Bill soft deleted" });
  } catch (err: unknown) {
    logger.error(`deleteBill error [billId=${req.params.id}]: ${getErrorMessage(err)}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorDocument([createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", getErrorMessage(err))])
    );
  }
};
