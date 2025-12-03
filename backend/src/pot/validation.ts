import { StatusCodes } from "http-status-codes";
import Joi from "joi";

import { joiToErrors } from "../utils/jsonapi/error";
import { PotCreateBody, PotDepositWithdrawBody, PotUpdateBody } from "./index";

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

export const validateCreatePot = (body: PotCreateBody) => {
  const result = createPotSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};

export const validateUpdatePot = (body: PotUpdateBody) => {
  const result = updatePotSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};

export const validateDepositWithdraw = (body: PotDepositWithdrawBody) => {
  const result = depositWithdrawSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};
