import { Router } from "express";

import { createBill, deleteBill, getBillById, getBills, getSummary, updateBill } from "../bill/controller";

const router = Router();

router.get("/", getBills);
router.get("/summary", getSummary);
router.get("/:id", getBillById);
router.post("/", createBill);
router.patch("/:id", updateBill);
router.delete("/:id", deleteBill);

export default router;