import { StatusCodes } from "http-status-codes";
import Joi from "joi";

import { joiToErrors } from "../utils/jsonapi/error"; 
import { BudgetAmountBody, BudgetCreateBody, BudgetUpdateBody } from "./index";

const budgetSchema = Joi.object({
  amount: Joi.number().positive(),
  maximumSpending: Joi.number().positive(),
  name: Joi.string().max(100),
  theme: Joi.string().max(50),
});

export const createBudgetSchema = budgetSchema.fork(
  ["name", "theme", "amount", "maximumSpending"],
  (field) => field.required()
);

export const updateBudgetSchema = budgetSchema.min(1);

export const depositWithdrawSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

export const validateCreateBudget = (body: BudgetCreateBody) => {
  const result = createBudgetSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};

export const validateUpdateBudget = (body: BudgetUpdateBody) => {
  const result = updateBudgetSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};

export const validateDepositWithdraw = (body: BudgetAmountBody) => {
  const result = depositWithdrawSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};
