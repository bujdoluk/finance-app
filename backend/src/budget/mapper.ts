import { Resource } from "../utils/jsonapi/resource";
import { Budget } from "./index";

export const mapToBudgetResource = (b: Budget): Resource => ({
  attributes: {
    amount: b.amount,
    created_at: b.created_at,
    deleted_at: b.deleted_at,
    maximumSpending: b.maximumSpending,
    name: b.name,
    theme: b.theme,
    updated_at: b.updated_at
  },
  id: b.id.toString(),
  links: {
    self: `/v1/budgets/${String(b.id)}`
  },
  type: "budgets"
});

export default mapToBudgetResource;
