import { Router } from "express";

import { createBudget, deleteBudget, depositToBudget, getBudgetById, getBudgets, updateBudget, withdrawFromBudget } from "../budget/controller";

const router = Router();

router.get("/", getBudgets);
router.get("/:id", getBudgetById);
router.post("/", createBudget);
router.patch("/:id", updateBudget);
router.delete("/:id", deleteBudget);
router.post("/:id/deposit", depositToBudget);
router.post("/:id/withdraw", withdrawFromBudget);

export default router;