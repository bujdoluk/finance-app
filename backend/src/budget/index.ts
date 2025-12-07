
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

export const budgets: Budget[] = [];
