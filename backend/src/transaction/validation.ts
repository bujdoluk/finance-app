import { TransactionCreateBody } from "./index";

export const validateCreateTransaction = (data: TransactionCreateBody) => {
  const { amount, category, date, sender, sender_picture } = data;
  if (!amount || !category || !date || !sender || !sender_picture) {
    return "All fields are required";
  }
  return null;
};
