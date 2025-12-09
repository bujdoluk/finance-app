import { BudgetsInput } from "@db/dbSchema";
import { StatusCodes } from "http-status-codes";
import Joi from "joi"; 

import { joiToErrors } from "../utils/jsonapi/error";

const budgetSchema = Joi.object({
  amount: Joi.number().positive(),
  maximum_spending: Joi.number().positive(),
  name: Joi.string().max(100),
  theme: Joi.string().max(50),
});

export const createBudgetSchema = budgetSchema.fork(
  ["name", "theme", "amount", "maximum_spending"],
  (field) => field.required()
);

export const updateBudgetSchema = budgetSchema.min(1);

export const depositWithdrawSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

export const validateCreateBudget = (body: BudgetsInput) => {
  const result = createBudgetSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};

export const validateUpdateBudget = (body: BudgetsInput) => {
  const result = updateBudgetSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};

export const validateDepositWithdraw = (body: BudgetsInput) => {
  const result = depositWithdrawSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};
