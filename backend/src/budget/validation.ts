import { BudgetAmountBody, BudgetCreateBody, BudgetUpdateBody } from "./index";

export const validateCreateBudget = (body: BudgetCreateBody): null | string => {
  if (!body.name || !body.theme || !body.amount || !body.maximumSpending) {
    return "name, theme, amount, and maximumSpending are required";
  }
  return null;
};

export const validateUpdateBudget = (body: BudgetUpdateBody): null | string => {
  if (!body.name && !body.theme && !body.amount && !body.maximumSpending) {
    return "At least one field must be provided to update";
  }
  return null;
};

export const validateDepositWithdraw = (body: BudgetAmountBody): null | string => {
  if (typeof body.amount !== "number" || body.amount <= 0) {
    return "Amount must be a positive number";
  }
  return null;
};
