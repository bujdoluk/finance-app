import { BudgetAmountBody, BudgetCreateBody, BudgetUpdateBody } from "./index";

export const validateCreateBudget = (data: BudgetCreateBody) => {
  const { amount, maximumSpending, name, theme } = data;
  if (!name || !theme || !maximumSpending || !amount) {
    return "name, maximumSpending, theme and amount are required";
  }
  return null;
};

export const validateUpdateBudget = (data: BudgetUpdateBody) => {
  if (data.maximumSpending !== undefined && typeof data.maximumSpending !== "number") {
    return "maximumSpending must be a number";
  }
  return null;
};

export const validateDepositWithdraw = (data: BudgetAmountBody) => {
  if (typeof data.amount !== "number" || data.amount <= 0) {
    return "Amount must be a positive number";
  }
  return null;
};
