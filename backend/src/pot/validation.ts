import { PotCreateBody, PotDepositWithdrawBody, PotUpdateBody } from "./index";

export function validateCreatePot(body: PotCreateBody): null | string {
  if (!body.name || !body.theme || !body.target || !body.total_saved || !body.amount) {
    return "All fields are required";
  }
  return null;
}

export function validateDepositWithdraw(body: PotDepositWithdrawBody): null | string {
  if (typeof body.amount !== "number" || body.amount <= 0) {
    return "Amount must be a positive number";
  }
  return null;
}

export function validateUpdatePot(body: PotUpdateBody): null | string {
  if (
    body.total_saved !== undefined &&
    typeof body.total_saved !== "number"
  ) return "total_saved must be a number";

  if (
    body.target !== undefined &&
    typeof body.target !== "number"
  ) return "target must be a number";

  return null;
}
