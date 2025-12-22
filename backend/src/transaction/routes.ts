import { Router } from "express";

import { 
  createTransaction, 
  deleteTransaction, 
  getTransactionById, 
  getTransactions, 
  getTransactionCategories, 
  importTransactions, 
  getBalance, 
} from "./controller";
import multer from 'multer';
import path from 'path';

const upload = multer({
  dest: path.join(process.cwd(), 'tmp'),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files allowed'));
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/import', upload.single('file'), importTransactions);
router.get("/balance", getBalance);
router.get("/categories", getTransactionCategories);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
