export interface Budget {
  amount: number;
  created_at: string;
  deleted_at: boolean;
  id: number;
  maximumSpending: number;
  name: string;
  theme: string;
  updated_at: string;
}

export interface BudgetAmountBody {
  amount: number;
}

export type BudgetCreateBody = Omit<
  Budget,
  "created_at" | "deleted_at" | "id" | "updated_at"
>;

export type BudgetUpdateBody = Partial<
  Pick<Budget, "maximumSpending" | "name" | "theme">
>;

export const budgets: Budget[] = [
  {
    amount: 0,
    created_at: new Date().toISOString(),
    deleted_at: false,
    id: 1,
    maximumSpending: 300,
    name: "Groceries",
    theme: "green",
    updated_at: new Date().toISOString()
  }
];
