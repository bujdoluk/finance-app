import { Transactions, TransactionsInput } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";
import transactionRepository from "./repository";
import { importTransactionsFromCSV } from '../utils/imports/csv';
import fs from 'fs/promises';

export const transactionService = {
  async create(body: TransactionsInput): Promise<Transactions> {
    try {
      return await transactionRepository.create(body);
    } catch (err: unknown) {
      logger.error(`createTransaction error: ${getErrorMessage(err)}`);
      throw err; 
    }
  },

  async importFromCSV(filePath: string): Promise<number> {
    try {
      const transactions = await importTransactionsFromCSV(filePath);
      await transactionRepository.createMany(transactions);
      await fs.unlink(filePath); 
      return transactions.length;
    } catch (err: unknown) {
      logger.error(`importFromCSV error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async delete(id: number): Promise<null | Transactions> {
    try {
      const transaction = await transactionRepository.getById(id);
      if (!transaction) return null;

      return await transactionRepository.delete(id);
    } catch (err: unknown) {
      logger.error(`deleteTransaction error [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      return await transactionRepository.getCategories();
    } catch (err: unknown) {
      logger.error(`transactionService.getCategories error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async get(query?: Record<string, unknown>): Promise<{ rows: Transactions[]; total: number }> {
    try {
      return await transactionRepository.get(query); 
    } catch (err: unknown) {
      logger.error(`getTransactions error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getById(id: number): Promise<null | Transactions> {
    try {
      return await transactionRepository.getById(id);
    } catch (err: unknown) {
      logger.error(`getTransactionById error [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default transactionService;
