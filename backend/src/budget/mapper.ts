import { Budgets } from "../../database/dbSchema";
import { Resource } from "../utils/jsonapi/resource";
import { Request } from "express";

/**
 * Map a Budget type interface into a JSON:API Resource
 */
export const mapToBudgetResource = (budget: Budgets): Resource => ({
  attributes: {
    amount: budget.amount,
    created_at: budget.created_at,
    maximum_spending: budget.maximum_spending,
    name: budget.name,
    theme: budget.theme,
  },
  id: String(budget.id),
  links: {
    self: `/v1/budgets/${String(budget.id)}`,
  },
  type: "budgets",
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
 * Budgets collection JSON:API Response
 */
export const mapToBudgetsResponse = (data: Budgets[], total: number, req: Request) => {
  const offset = Number(req.query["page[offset]"]);
  const limit = Number(req.query["page[limit]"]);

  return {
    data: data.map(mapToBudgetResource),
    links: buildPaginationLinks(req, offset, limit, total),
    meta: {
      total,
      limit,
      offset,
    },
  };
};

export default mapToBudgetsResponse;

