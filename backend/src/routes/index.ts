import { Router } from "express";

import authRouter from "../auth/routes";
import billRouter from "../bill/routes";
import budgetRouter from "../budget/routes";
import potRouter from "../pot/routes";
import transactionRouter from "../transaction/routes";
import userRouter from "../user/routes";
import { getHealth } from "../utils/health-controller";
import { getPerformanceInfo } from "../utils/perf-controller";

const router = Router();

router.get("/health", getHealth);
router.get("/perf", getPerformanceInfo);

router.use("/auth", authRouter); 
router.use("/users", userRouter);           
router.use("/pots", potRouter);              
router.use("/budgets", budgetRouter);       
router.use("/bills", billRouter);            
router.use("/transactions", transactionRouter); 

export default router;
