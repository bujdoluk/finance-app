import { Budget } from "./index";

export const mapToBudgetEntity = (b: Budget) => ({
  amount: b.amount,
  created_at: b.created_at,
  deleted_at: b.deleted_at,
  id: b.id,
  maximumSpending: b.maximumSpending,
  name: b.name,
  theme: b.theme,
  updated_at: b.updated_at
});

export default mapToBudgetEntity;
