import logger, { getErrorMessage } from "../utils/logger/logger";
import { Transaction, transactions } from "./index";

export const transactionRepository = {
  create(transaction: Transaction): Transaction {
    try {
      transactions.push(transaction);
      logger.info(`Transaction created [transactionId=${String(transaction.id)}]`);
      return transaction;
    } catch (err: unknown) {
      logger.error(`create transaction failed [transactionId=${String(transaction.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  findAll(): Transaction[] {
    try {
      return transactions.filter(t => !t.deleted_at);
    } catch (err: unknown) {
      logger.error(`findAll transactions failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  findById(id: number): Transaction | undefined {
    try {
      return transactions.find(t => t.id === id && !t.deleted_at);
    } catch (err: unknown) {
      logger.error(`findById failed [transactionId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  softDelete(transaction: Transaction): Transaction {
    try {
      logger.info(`Transaction soft deleted [transactionId=${String(transaction.id)}]`);
      return transaction;
    } catch (err: unknown) {
      logger.error(`softDelete failed [transactionId=${String(transaction.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  update(transaction: Transaction): Transaction {
    try {
      logger.info(`Transaction updated [transactionId=${String(transaction.id)}]`);
      return transaction;
    } catch (err: unknown) {
      logger.error(`update failed [transactionId=${String(transaction.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default transactionRepository;
