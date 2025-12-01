import { TransactionCreateBody } from "./index";

export function validateCreateTransaction(body: TransactionCreateBody): null | string {
  if (!body.amount || typeof body.amount !== "number") return "Amount is required";
  if (!body.category) return "Category is required";
  if (!body.date) return "Date is required";
  if (!body.sender) return "Sender is required";
  if (!body.sender_picture) return "Sender picture is required";

  return null;
}
