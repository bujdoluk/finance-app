import { Router } from "express";

import { createTransaction, deleteTransaction, getTransactionById, getTransactions, getTransactionCategories } from "./controller";

const router = Router();

router.get("/categories", getTransactionCategories);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
