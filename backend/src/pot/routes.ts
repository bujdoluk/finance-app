import { Router } from "express";

import {
  createPot,
  deletePot,
  depositToPot,
  getAllPots,
  getPotById,
  withdrawFromPot,
} from "../pot/controller";

const router = Router();

router.get("/", getAllPots);
router.get("/:id", getPotById);
router.post("/", createPot);
router.delete("/:id", deletePot);
router.post("/:id/deposit", depositToPot);
router.post("/:id/withdraw", withdrawFromPot);

export default router;
