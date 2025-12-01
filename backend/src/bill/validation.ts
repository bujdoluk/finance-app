import { BillCreateBody, BillUpdateBody } from "./index";

export const validateCreateBill = (body: BillCreateBody): null | string => {
  if (!body.name) return "Name is required";
  if (!body.amount) return "Amount is required";
  if (!body.next_run) return "Next run date is required";
  return null;
};

export const validateUpdateBill = (body: BillUpdateBody): null | string => {
  if (
    body.amount !== undefined &&
    (typeof body.amount !== "number" || body.amount <= 0)
  ) return "Amount must be a positive number";
  return null;
};
