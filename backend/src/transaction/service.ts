import { Resource } from "../utils/jsonapi/resource";
import { Transaction, TransactionCreateBody } from "./index";
import { mapToTransactionResource } from "./mapper";
import transactionRepository from "./repository";

export const transactionService = {
  createTransaction(body: TransactionCreateBody): Resource {
    const allTransactions = transactionRepository.findAll();
    const newId = allTransactions.length ? allTransactions[allTransactions.length - 1].id + 1 : 1;

    const newTransaction: Transaction = {
      ...body,
      created_at: new Date().toISOString(),
      deleted_at: false,
      id: newId,
      updated_at: new Date().toISOString(),
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
  },
};

export default transactionService;
