import { Router } from "express";

import {
  createBill,
  deleteBill,
  getAllBills,
  getBillById,
  updateBill
} from "../bill/controller";
import {
  createBudget,
  deleteBudget,
  depositToBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  withdrawFromBudget
} from "../budget/controller";
import {
  createPot,
  deletePot,
  depositToPot,
  getAllPots,
  getPotById,
  updatePot,
  withdrawFromPot,
} from "../pot/controller";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionById
} from "../transaction/controller";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser
} from "../user/controller";
import { getHealth } from '../utils/health-controller';
import { getPerformanceInfo } from '../utils/perf-controller';

const router = Router();

router.get("/health", getHealth)
router.get("/perf", getPerformanceInfo)

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/transactions", getAllTransactions);
router.get("/transactions/:id", getTransactionById);
router.post("/transactions", createTransaction);
router.delete("/transactions/:id", deleteTransaction);

router.get("/pots", getAllPots);
router.get("/pots/:id", getPotById);
router.post("/pots", createPot);
router.patch("/pots/:id", updatePot);
router.delete("/pots/:id", deletePot);
router.post("/pots/:id/deposit", depositToPot);
router.post("/pots/:id/withdraw", withdrawFromPot);

router.get("/budgets", getAllBudgets);
router.get("/budgets/:id", getBudgetById);
router.post("/budgets", createBudget);
router.patch("/budgets/:id", updateBudget);
router.delete("/budgets/:id", deleteBudget);
router.post("/budgets/:id/deposit", depositToBudget);
router.post("/budgets/:id/withdraw", withdrawFromBudget);

router.get("/bills", getAllBills);
router.get("/bills/:id", getBillById);
router.post("/bills", createBill);
router.patch("/bills/:id", updateBill);
router.delete("/bills/:id", deleteBill);

export default router;
