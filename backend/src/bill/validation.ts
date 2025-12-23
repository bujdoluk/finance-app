import Joi from "joi";

import { BillsInput } from "../../database/dbSchema";

export const createBillSchema = Joi.object<BillsInput>({
  amount: Joi.number().required(),
  frequency: Joi.string().optional().allow(null),
  name: Joi.string().required(),
  due_date: Joi.date().required(),
  status: Joi.string().valid("paid", "unpaid", "due_soon").required(),
});

export const updateBillSchema = Joi.object<BillsInput>({
  amount: Joi.number().optional(),
  frequency: Joi.string().optional().allow(null),
  name: Joi.string().optional(),
  due_date: Joi.date().optional(),
  status: Joi.string().optional(),
}).min(1);
