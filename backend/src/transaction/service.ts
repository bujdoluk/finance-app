import { Resource } from "../utils/jsonapi/resource";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { Transaction, TransactionCreateBody } from "./index";
import { mapToTransactionResource } from "./mapper";
import transactionRepository from "./repository";

export const transactionService = {
  createTransaction(body: TransactionCreateBody): Resource {
    try {
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
    } catch (err: unknown) {
      logger.error(`createTransaction error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  deleteTransaction(id: number): null | Resource {
    try {
      const t = transactionRepository.findById(id);
      if (!t) {
        logger.warn(`deleteTransaction: Transaction not found [transactionId=${String(id)}]`);
        return null;
      }

      t.deleted_at = true;
      t.updated_at = new Date().toISOString();
      transactionRepository.softDelete(t);

      return mapToTransactionResource(t);
    } catch (err: unknown) {
      logger.error(`deleteTransaction error [transactionId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getAllTransactions(): Resource[] {
    try {
      return transactionRepository.findAll().map(mapToTransactionResource);
    } catch (err: unknown) {
      logger.error(`getAllTransactions error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getTransactionById(id: number): null | Resource {
    try {
      const t = transactionRepository.findById(id);
      if (!t) {
        logger.warn(`getTransactionById: Transaction not found [transactionId=${String(id)}]`);
        return null;
      }
      return mapToTransactionResource(t);
    } catch (err: unknown) {
      logger.error(`getTransactionById error [transactionId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default transactionService;
