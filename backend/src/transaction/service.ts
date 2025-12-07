import { Transactions, TransactionsInput } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";
import transactionRepository from "./repository";

export const transactionService = {
  async createTransaction(body: TransactionsInput): Promise<Transactions> {
    try {
      const created = await transactionRepository.create(body);
      return created;
    } catch (err: unknown) {
      logger.error(`createTransaction error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deleteTransaction(id: number): Promise<null | Transactions> {
    try {
      const transaction = await transactionRepository.findById(id);
      if (!transaction) return null;
      return await transactionRepository.softDelete(id);
    } catch (err: unknown) {
      logger.error(`deleteTransaction error [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getAllTransactions(): Promise<Transactions[]> {
    try {
      return await transactionRepository.findAll();
    } catch (err: unknown) {
      logger.error(`getAllTransactions error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getTransactionById(id: number): Promise<null | Transactions> {
    try {
      return await transactionRepository.findById(id);
    } catch (err: unknown) {
      logger.error(`getTransactionById error [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default transactionService;
