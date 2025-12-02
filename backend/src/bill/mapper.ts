import { Resource } from "../utils/jsonapi/resource";
import { Bill } from "./index";

export const mapToBillResource = (b: Bill): Resource => ({
  attributes: {
    amount: b.amount,
    created_at: b.created_at,
    deleted_at: b.deleted_at,
    frequency: b.frequency,
    name: b.name,
    next_run: b.next_run,
    updated_at: b.updated_at
  },
  id: b.id.toString(),
  links: {
    self: `/v1/bills/${String(b.id)}`
  },
  type: "bills"
});

export default mapToBillResource;
