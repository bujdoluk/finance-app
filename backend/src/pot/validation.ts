import { StatusCodes } from "http-status-codes";
import Joi from "joi";

import { PotsInput } from "../../database/dbSchema";
import { joiToErrors } from "../utils/jsonapi/error";

const potSchema = Joi.object({
  name: Joi.string().max(100),
  target: Joi.number().positive(),
  theme: Joi.string().max(50),
});

export const createPotSchema = potSchema.fork(
  ["name", "theme", "target"],
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

export const validateDepositAmount = (body: PotsInput) => {
  const result = depositWithdrawSchema.validate(body, { abortEarly: false });
  if (result.error) {
    return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  }
  return null;
};
