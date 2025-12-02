import { Resource } from "../utils/jsonapi/resource";
import { Transaction } from "./index";

export const mapToTransactionResource = (t: Transaction): Resource => ({
  attributes: {
    amount: t.amount,
    category: t.category,
    created_at: t.created_at,
    date: t.date,
    deleted_at: t.deleted_at,
    sender: t.sender,
    sender_picture: t.sender_picture,
    updated_at: t.updated_at
  },
  id: t.id.toString(),
  links: {
    self: `/v1/transactions/${String(t.id)}`
  },
  type: "transactions"
});

export default mapToTransactionResource;
