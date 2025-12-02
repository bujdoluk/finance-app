import { Router } from "express";

import {
  createBill,
  deleteBill,
  getAllBills,
  getBillById,
  updateBill
} from "../bill/controller";

const router = Router();

router.get("/", getAllBills);
router.get("/:id", getBillById);
router.post("/", createBill);
router.patch("/:id", updateBill);
router.delete("/:id", deleteBill);

export default router;