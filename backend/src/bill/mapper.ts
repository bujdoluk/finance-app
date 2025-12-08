import { Bills } from "../../database/dbSchema";
import { Resource } from "../utils/jsonapi/resource";

/**
 * Map a Bills type interface to JSON:API Resource
 */
export const mapToBillResource = (bill: Bills): Resource => ({
  attributes: {
    amount: bill.amount,
    created_at: bill.created_at,
    frequency: bill.frequency,
    name: bill.name,
    next_run: bill.next_run,
  },
  id: String(bill.id),
  links: {
    self: `/v1/bills/${String(bill.id)}`,
  },
  type: "bills",
});
