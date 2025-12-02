import { Router } from "express";

import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionById,
} from "./controller";

const router = Router();

router.get("/", getAllTransactions);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
