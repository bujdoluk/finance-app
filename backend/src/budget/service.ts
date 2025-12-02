import { Resource } from "../utils/jsonapi/resource";
import { 
  Budget, 
  BudgetAmountBody, 
  BudgetCreateBody, 
  BudgetUpdateBody 
} from "./index";
import { mapToBudgetResource } from "./mapper";
import budgetRepository from "./repository";

const budgetService = {
  createBudget(body: BudgetCreateBody): Resource {
    const allBudgets = budgetRepository.findAll();
    const newId = allBudgets.length ? allBudgets[allBudgets.length - 1].id + 1 : 1;

    const newBudget: Budget = {
      ...body,
      created_at: new Date().toISOString(),
      deleted_at: false,
      id: newId,
      updated_at: new Date().toISOString()
    };

    const createdBudget = budgetRepository.create(newBudget);
    return mapToBudgetResource(createdBudget);
  },

  deleteBudget(id: number): Resource | undefined {
    const budget = budgetRepository.findById(id);
    if (!budget) return undefined;
    return mapToBudgetResource(budgetRepository.softDelete(budget));
  },

  depositToBudget(id: number, body: BudgetAmountBody): Resource | undefined {
    const budget = budgetRepository.findById(id);
    if (!budget) return undefined;
    return mapToBudgetResource(budgetRepository.deposit(budget, body));
  },

  getAllBudgets(): Resource[] {
    return budgetRepository.findAll().map(mapToBudgetResource);
  },

  getBudgetById(id: number): Resource | undefined {
    const budget = budgetRepository.findById(id);
    return budget ? mapToBudgetResource(budget) : undefined;
  },

  updateBudget(id: number, body: BudgetUpdateBody): Resource | undefined {
    const budget = budgetRepository.findById(id);
    if (!budget) return undefined;

    Object.assign(budget, body);

    return mapToBudgetResource(budgetRepository.update(budget));
  },

  withdrawFromBudget(id: number, body: BudgetAmountBody): null | Resource {
    const budget = budgetRepository.findById(id);
    if (!budget) return null;

    const updated = budgetRepository.withdraw(budget, body);
    return updated ? mapToBudgetResource(updated) : null;
  }
};

export default budgetService;
