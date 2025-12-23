import { Bills } from "../../database/dbSchema";
import { Resource } from "../utils/jsonapi/resource";
import { Request } from "express";

/**
 * Map a Bills type interface to JSON:API Resource
 */
export const mapToBillResource = (bill: Bills): Resource => ({
  attributes: {
    amount: bill.amount,
    created_at: bill.created_at,
    frequency: bill.frequency,
    name: bill.name,
    due_date: bill.due_date,
    status: bill.status,
  },
  id: String(bill.id),
  links: {
    self: `/v1/bills/${String(bill.id)}`,
  },
  type: "bills",
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
 * Bills collection JSON:API Response
 */
export const mapToBillsResponse = (data: Bills[], total: number, req: Request) => {
  const offset = Number(req.query["page[offset]"]);
  const limit = Number(req.query["page[limit]"]);

  return {
    data: data.map(mapToBillResource),
    links: buildPaginationLinks(req, offset, limit, total),
    meta: {
      total,
      limit,
      offset,
    },
  };
};

export const mapToSummaryResource = (
  summary: { 
    paid: number, 
    unpaid: number; 
    due_soon: number, 
    paidTotal: number, 
    unpaidTotal: number, 
    dueSoonTotal: number, 
}): Resource => ({
  id: "summary",
  type: "summary",
  attributes: {
    paid: summary.paid,
    unpaid: summary.unpaid,
    due_soon: summary.due_soon,
    paidTotal: summary.paidTotal,
    unpaidTotal: summary.unpaidTotal,
    dueSoonTotal: summary.dueSoonTotal,
  },
  links: {
    self: "/v1/bills/summary"
  }
});

export default mapToBillsResponse;

