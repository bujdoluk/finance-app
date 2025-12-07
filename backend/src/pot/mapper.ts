import { Pots } from "../../database/dbSchema";
import { Resource } from "../utils/jsonapi/resource";

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

export default mapToPotResource;
