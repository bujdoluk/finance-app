import { Transaction } from "./index";

export const mapToTransactionEntity = (t: Transaction) => ({
  amount: t.amount,
  category: t.category,
  created_at: t.created_at,
  date: t.date,
  deleted_at: t.deleted_at,
  id: t.id,
  sender: t.sender,
  sender_picture: t.sender_picture,
  updated_at: t.updated_at
});

export default mapToTransactionEntity;
