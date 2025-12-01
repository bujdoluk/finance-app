import { Budget, BudgetAmountBody, BudgetCreateBody, BudgetUpdateBody } from "./index";
import mapToBudgetEntity from "./mapper";
import budgetRepository from "./repository";

const budgetService = {
  createBudget(body: BudgetCreateBody): Budget {
    const allBudgets = budgetRepository.findAll();
    const newId = allBudgets.length ? allBudgets[allBudgets.length - 1].id + 1 : 1;

    const newBudget: Budget = {
      amount: body.amount,
      created_at: new Date().toISOString(),
      deleted_at: false,
      id: newId,
      maximumSpending: body.maximumSpending,
      name: body.name,
      theme: body.theme,
      updated_at: new Date().toISOString()
    };

    const createdBudget = budgetRepository.create(newBudget);
    return mapToBudgetEntity(createdBudget);
  },

  deleteBudget(id: number): Budget | undefined {
    const budget = budgetRepository.findById(id);
    if (!budget) return undefined;
    return mapToBudgetEntity(budgetRepository.softDelete(budget));
  },

  depositToBudget(id: number, body: BudgetAmountBody): Budget | undefined {
    const budget = budgetRepository.findById(id);
    if (!budget) return undefined;
    return mapToBudgetEntity(budgetRepository.deposit(budget, body));
  },

  getAllBudgets(): Budget[] {
    return budgetRepository.findAll().map(mapToBudgetEntity);
  },

  getBudgetById(id: number): Budget | undefined {
    const budget = budgetRepository.findById(id);
    return budget ? mapToBudgetEntity(budget) : undefined;
  },

  updateBudget(id: number, body: BudgetUpdateBody): Budget | undefined {
    const budget = budgetRepository.findById(id);
    if (!budget) return undefined;

    if (body.name !== undefined) budget.name = body.name;
    if (body.theme !== undefined) budget.theme = body.theme;
    if (body.amount !== undefined) budget.amount = body.amount;
    if (body.maximumSpending !== undefined) budget.maximumSpending = body.maximumSpending;

    return mapToBudgetEntity(budgetRepository.update(budget));
  },

  withdrawFromBudget(id: number, body: BudgetAmountBody): Budget | null {
    const budget = budgetRepository.findById(id);
    if (!budget) return null;
    return budgetRepository.withdraw(budget, body);
  }
};

export default budgetService;
