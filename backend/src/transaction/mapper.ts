import { Transactions } from "../../database/dbSchema";
import { Resource } from "../utils/jsonapi/resource";

/**
 * Map a Transaction type interface to a JSON:API Resource
 */
export const mapToTransactionResource = (transaction: Transactions): Resource => ({
  attributes: {
    amount: transaction.amount,
    category: transaction.category,
    created_at: transaction.created_at,
    date: transaction.date,
    sender: transaction.sender,
    sender_picture: transaction.sender_picture,
  },
  id: String(transaction.id),
  links: {
    self: `/v1/transactions/${String(transaction.id)}`,
  },
  type: "transactions",
});

export default mapToTransactionResource;
