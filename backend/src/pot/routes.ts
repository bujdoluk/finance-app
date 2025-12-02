import { Router } from "express";

import {
  createPot,
  deletePot,
  depositToPot,
  getAllPots,
  getPotById,
  updatePot,
  withdrawFromPot,
} from "../pot/controller";

const router = Router();

router.get("/", getAllPots);
router.get("/:id", getPotById);
router.post("/", createPot);
router.patch("/:id", updatePot);
router.delete("/:id", deletePot);
router.post("/:id/deposit", depositToPot);
router.post("/:id/withdraw", withdrawFromPot);

export default router;
