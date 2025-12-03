import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  createError,
  createErrorDocument,
  joiToErrors,
} from "../utils/jsonapi/error";
import { Bill } from "./index";
import billService, { BillCreateData } from "./service";
import { createBillSchema, updateBillSchema } from "./validation";

export const getAllBills = (_req: Request, res: Response) => {
  try {
    const bills = billService.getAllBills();
    return res.json(bills);
  } catch (e) {
    return res
      .json(
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

export const getBillById = (req: Request<{ id: string }>, res: Response) => {
  try {
    const bill = billService.getBillById(Number(req.params.id));

    if (!bill) {
      return res.json(
        createErrorDocument([
          createError(
            StatusCodes.NOT_FOUND,
            "Not Found",
            "Bill not found",
            { pointer: "/data/id" }
          ),
        ])
      );
    }

    return res.json(bill);
  } catch (e) {
    return res
      .json(
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

export const createBill = (
  req: Request<object, object, Partial<Bill>>,
  res: Response
) => {
  try {
    const validation = createBillSchema.validate(req.body, {
      abortEarly: false,
    });

    if (validation.error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(joiToErrors(validation.error.details, StatusCodes.BAD_REQUEST));
    }

    const data = validation.value as BillCreateData;
    const bill = billService.createBill(data);

    return res
      .status(StatusCodes.CREATED)
      .json({ bill, message: "Bill created" });
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
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

export const updateBill = (
  req: Request<{ id: string }, object, Partial<Bill>>,
  res: Response
) => {
  try {
    const validation = updateBillSchema.validate(req.body, {
      abortEarly: false,
    });

    if (validation.error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(joiToErrors(validation.error.details, StatusCodes.BAD_REQUEST));
    }

    const data = validation.value as Partial<Bill>;

    const bill = billService.updateBill(
      Number(req.params.id),
      data
    );

    if (!bill) {
      return res.status(StatusCodes.NOT_FOUND).json(
        createErrorDocument([
          createError(
            StatusCodes.NOT_FOUND,
            "Not Found",
            "Bill not found",
            { pointer: "/data/id" }
          ),
        ])
      );
    }

    return res.json({ bill, message: "Bill updated" });
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
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

export const deleteBill = (req: Request<{ id: string }>, res: Response) => {
  try {
    const bill = billService.deleteBill(Number(req.params.id));

    if (!bill) {
      return res.json(
        createErrorDocument([
          createError(
            StatusCodes.NOT_FOUND,
            "Not Found",
            "Bill not found",
            { pointer: "/data/id" }
          ),
        ])
      );
    }

    return res.json({ bill, message: "Bill soft deleted" });
  } catch (e) {
    return res
      .json(
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
