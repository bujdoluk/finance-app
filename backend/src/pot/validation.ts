import { PotCreateBody, PotDepositWithdrawBody, PotUpdateBody } from "./index";

export const validateCreatePot = (data: PotCreateBody) => {
  const { amount, name, target, theme, total_saved } = data;
  if (!name || !theme || !target || !total_saved || !amount) {
    return "All fields are required";
  }
  return null;
};

export const validateUpdatePot = (data: PotUpdateBody) => {
  if (data.total_saved !== undefined && typeof data.total_saved !== "number") {
    return "total_saved must be a number";
  }
  if (data.target !== undefined && typeof data.target !== "number") {
    return "target must be a number";
  }
  return null;
};

export const validateDepositWithdraw = (data: PotDepositWithdrawBody) => {
  if (typeof data.amount !== "number" || data.amount <= 0) {
    return "Amount must be a positive number";
  }
  return null;
};
