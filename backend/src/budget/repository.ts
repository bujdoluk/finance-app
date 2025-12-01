import { Budget, BudgetAmountBody, budgets } from "./index";

export const budgetRepository = {
  create(budget: Budget): Budget {
    budgets.push(budget);
    return budget;
  },

  deposit(budget: Budget, body: BudgetAmountBody): Budget {
    budget.maximumSpending += body.amount;
    budget.updated_at = new Date().toISOString();
    return budget;
  },

  findAll(): Budget[] {
    return budgets.filter(b => !b.deleted_at);
  },

  findById(id: number): Budget | undefined {
    return budgets.find(b => b.id === id && !b.deleted_at);
  },

  softDelete(budget: Budget): Budget {
    budget.deleted_at = true;
    budget.updated_at = new Date().toISOString();
    return budget;
  },

  update(budget: Budget): Budget {
    budget.updated_at = new Date().toISOString();
    return budget;
  },

  withdraw(budget: Budget, body: BudgetAmountBody): Budget | null {
    if (body.amount > budget.maximumSpending) return null;

    budget.maximumSpending -= body.amount;
    budget.updated_at = new Date().toISOString();
    return budget;
  }
};

export default budgetRepository;
