import { Router } from "express";

import { createTransaction, deleteTransaction, getTransactionById, getTransactions } from "./controller";

const router = Router();

router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
