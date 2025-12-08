import { Budgets } from "../../database/dbSchema";
import { Resource } from "../utils/jsonapi/resource";

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

export default mapToBudgetResource;
