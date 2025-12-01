import {
  Transaction,
  TransactionCreateBody
} from "./index";
import mapToTransactionEntity from "./mapper";
import transactionRepository from "./repository";

export const transactionService = {
  createTransaction(body: TransactionCreateBody) {
    const newTransaction: Transaction = {
      amount: body.amount,
      category: body.category,
      created_at: new Date().toISOString(),
      date: body.date,
      deleted_at: false,
      id: Date.now(),
      sender: body.sender,
      sender_picture: body.sender_picture,
      updated_at: new Date().toISOString()
    };

    const stored = transactionRepository.create(newTransaction);
    return mapToTransactionEntity(stored);
  },

  deleteTransaction(id: number) {
    const t = transactionRepository.findById(id);
    if (!t) return null;

    t.deleted_at = true;
    t.updated_at = new Date().toISOString();

    transactionRepository.softDelete(t);
    return mapToTransactionEntity(t);
  },

  getAllTransactions() {
    return transactionRepository.findAll().map(mapToTransactionEntity);
  },

  getTransactionById(id: number) {
    const t = transactionRepository.findById(id);
    return t ? mapToTransactionEntity(t) : null;
  }
};

export default transactionService;
