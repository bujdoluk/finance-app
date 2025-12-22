import { Transactions } from "../../database/dbSchema";
import { Resource } from "../utils/jsonapi/resource";
import { Request } from "express";

/**
 * Map a Transaction type interface to a JSON:API Resource
 */
export const mapToTransactionResource = (transaction: Transactions): Resource => ({
  attributes: {
    amount: transaction.amount,
    category: transaction.category,
    transaction_type: transaction.transaction_type,
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

/**
 * Helper method for building links for response object
 */
const buildPaginationLinks = (req: Request, offset: number, limit: number, total: number) => {
  const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
  const last = Math.max(0, Math.floor((total - 1) / limit) * limit);

  const link = (offset: number) => `${baseUrl}?page[offset]=${offset}&page[limit]=${limit}`;

  return {
    first: link(0),
    last: link(last),
    prev: offset > 0 ? link(Math.max(0, offset - limit)) : null,
    next: offset + limit < total ? link(offset + limit) : null,
  };
};

/**
 * Transactions collection JSON:API Response
 */
export const mapToTransactionsResponse = (data: Transactions[], total: number, req: Request) => {
  const offset = Number(req.query["page[offset]"]);
  const limit = Number(req.query["page[limit]"]);

  return {
    data: data.map(mapToTransactionResource),
    links: buildPaginationLinks(req, offset, limit, total),
    meta: {
      total,
      limit,
      offset,
    },
  };
};

/**
 * Balance JSON:API Resource
 */
export const mapToBalanceResource = (summary: { income: number; expenses: number; balance: number }): Resource => ({
  id: "balance",
  type: "balance",
  attributes: {
    income: summary.income,
    expenses: summary.expenses,
    balance: summary.balance,
  },
  links: {
    self: "/v1/transactions/balance",
  },
});

export default mapToTransactionsResponse;
