import { Pots } from "../../database/dbSchema";
import { Resource } from "../utils/jsonapi/resource";
import { Request } from "express";

/**
 * Map a Pot type interface into a JSON:API Resource
 */
export const mapToPotResource = (pot: Pots): Resource => ({
  attributes: {
    amount: pot.amount,
    created_at: pot.created_at,
    name: pot.name,
    target: pot.target,
    theme: pot.theme,
    total_saved: pot.total_saved,
  },
  id: String(pot.id),
  links: {
    self: `/v1/pots/${String(pot.id)}`,
  },
  type: "pots",
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
 * Pots collection JSON:API Response
 */
export const mapToPotsResponse = (data: Pots[], total: number, req: Request) => {
  const offset = Number(req.query["page[offset]"]);
  const limit = Number(req.query["page[limit]"]);

  return {
    data: data.map(mapToPotResource),
    links: buildPaginationLinks(req, offset, limit, total),
    meta: {
      total,
      limit,
      offset,
    },
  };
};

export default mapToPotsResponse;


