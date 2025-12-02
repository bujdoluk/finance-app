import { Resource } from "../utils/jsonapi/resource";
import { Transaction, TransactionCreateBody } from "./index";
import { mapToTransactionResource } from "./mapper";
import transactionRepository from "./repository";

export const transactionService = {
  createTransaction(body: TransactionCreateBody): Resource {
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
    return mapToTransactionResource(stored);
  },

  deleteTransaction(id: number): null | Resource {
    const t = transactionRepository.findById(id);
    if (!t) return null;

    t.deleted_at = true;
    t.updated_at = new Date().toISOString();
    transactionRepository.softDelete(t);

    return mapToTransactionResource(t);
  },

  getAllTransactions(): Resource[] {
    return transactionRepository.findAll().map(mapToTransactionResource);
  },

  getTransactionById(id: number): null | Resource {
    const t = transactionRepository.findById(id);
    return t ? mapToTransactionResource(t) : null;
  }
};

export default transactionService;
