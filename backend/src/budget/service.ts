import { Budget, BudgetAmountBody, BudgetCreateBody, budgets, BudgetUpdateBody } from "./index";

const budgetService = {
  createBudget: (data: BudgetCreateBody): Budget => {
    const newBudget: Budget = {
      id: budgets.length ? budgets[budgets.length - 1].id + 1 : 1,
      ...data,
      created_at: new Date().toISOString(),
      deleted_at: false,
      updated_at: new Date().toISOString(),
    };
    budgets.push(newBudget);
    return newBudget;
  },

  deleteBudget: (id: number): Budget | undefined => {
    const budget = budgets.find(b => b.id === id && !b.deleted_at);
    if (!budget) return undefined;

    budget.deleted_at = true;
    budget.updated_at = new Date().toISOString();
    return budget;
  },

  depositToBudget: (id: number, data: BudgetAmountBody): Budget | undefined => {
    const budget = budgets.find(b => b.id === id && !b.deleted_at);
    if (!budget) return undefined;

    budget.maximumSpending += data.amount;
    budget.updated_at = new Date().toISOString();
    return budget;
  },

  getAllBudgets: (): Budget[] => {
    return budgets.filter(b => !b.deleted_at);
  },

  getBudgetById: (id: number): Budget | undefined => {
    return budgets.find(b => b.id === id && !b.deleted_at);
  },

  updateBudget: (id: number, data: BudgetUpdateBody): Budget | undefined => {
    const budget = budgets.find(b => b.id === id && !b.deleted_at);
    if (!budget) return undefined;

    if (data.name !== undefined) budget.name = data.name;
    if (data.maximumSpending !== undefined) budget.maximumSpending = data.maximumSpending;
    if (data.theme !== undefined) budget.theme = data.theme;

    budget.updated_at = new Date().toISOString();
    return budget;
  },

  withdrawFromBudget: (id: number, data: BudgetAmountBody): Budget | undefined => {
    const budget = budgets.find(b => b.id === id && !b.deleted_at);
    if (!budget || data.amount > budget.maximumSpending) return undefined;

    budget.maximumSpending -= data.amount;
    budget.updated_at = new Date().toISOString();
    return budget;
  },
};

export default budgetService;
