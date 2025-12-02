import { Resource } from "../utils/jsonapi/resource";
import { Pot } from "./index";

export const mapToPotResource = (pot: Pot): Resource => {
  return {
    attributes: {
      amount: pot.amount,
      created_at: pot.created_at,
      deleted_at: pot.deleted_at,
      name: pot.name,
      target: pot.target,
      theme: pot.theme,
      total_saved: pot.total_saved,
      updated_at: pot.updated_at
    },
    id: pot.id.toString(),
    links: {
      self: `/v1/pots/${String(pot.id)}`
    },
    type: "pots"
  };
};

export default mapToPotResource;
