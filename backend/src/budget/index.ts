
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

export interface BudgetCreateBody {
  amount: number;
  maximumSpending: number;
  name: string;
  theme: string;
}

export type BudgetUpdateBody = Partial<BudgetCreateBody>;

export const budgets: Budget[] = [
  {
    amount: 500,
    created_at: new Date().toISOString(),
    deleted_at: false,
    id: 1,
    maximumSpending: 500,
    name: "Groceries",
    theme: "Food",
    updated_at: new Date().toISOString()
  },
  {
    amount: 1000,
    created_at: new Date().toISOString(),
    deleted_at: false,
    id: 2,
    maximumSpending: 1000,
    name: "Vacation",
    theme: "Travel",
    updated_at: new Date().toISOString()
  }
];
