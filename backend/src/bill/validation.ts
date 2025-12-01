import { BillCreateBody, BillUpdateBody } from "./index";

export const validateCreateBill = (data: BillCreateBody) => {
  const { amount, name, next_run } = data;
  if (!name || !amount || !next_run) {
    return "name, amount, and next_run are required";
  }
  return null;
};

export const validateUpdateBill = (data: BillUpdateBody) => {
  if (data.amount !== undefined && typeof data.amount !== "number") {
    return "amount must be a number";
  }
  return null;
};
