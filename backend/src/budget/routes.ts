import { Router } from "express";

import {
  createBudget,
  deleteBudget,
  depositToBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  withdrawFromBudget
} from "../budget/controller";

const router = Router();

router.get("/", getAllBudgets);
router.get("/:id", getBudgetById);
router.post("/", createBudget);
router.patch("/:id", updateBudget);
router.delete("/:id", deleteBudget);
router.post("/:id/deposit", depositToBudget);
router.post("/:id/withdraw", withdrawFromBudget);

export default router;