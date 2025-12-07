import { StatusCodes } from "http-status-codes";
import Joi from "joi";

import { PotsInput } from "../../database/dbSchema";
import { joiToErrors } from "../utils/jsonapi/error";

const potSchema = Joi.object({
  amount: Joi.number().positive(),
  name: Joi.string().max(100),
  target: Joi.number().positive(),
  theme: Joi.string().max(50),
  total_saved: Joi.number().min(0),
});

export const createPotSchema = potSchema.fork(
  ["name", "theme", "target", "total_saved", "amount"],
  (field) => field.required()
);

export const updatePotSchema = potSchema.min(1);

export const depositWithdrawSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

export const validateCreatePot = (body: PotsInput) => {
  const result = createPotSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};

export const validateUpdatePot = (body: PotsInput) => {
  const result = updatePotSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};

export const validateDepositWithdraw = (body: PotsInput) => {
  const result = depositWithdrawSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};
