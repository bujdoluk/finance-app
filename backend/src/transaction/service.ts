import { FilterParams, Filters, parseFilter } from "@/utils/parseFilters";

import { Transactions, TransactionsInput } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";
import transactionRepository from "./repository";

export const transactionService = {
  async create(body: TransactionsInput): Promise<Transactions> {
    try {
      return await transactionRepository.create(body);
    } catch (err: unknown) {
      logger.error(`createTransaction error: ${getErrorMessage(err)}`);
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

  async filterAndSortTransactions(params: FilterParams): Promise<Transactions[]> {
    try {
      let parsedFilter: Filters | null = null;

      if (params.filter) {
        parsedFilter = parseFilter(params.filter);
      }

      return await transactionRepository.findFilteredOrSortedTransactions(parsedFilter, params.sort);
    } catch (err: unknown) {
      logger.error(`filterAndSortTransactions error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async get(): Promise<Transactions[]> {
    try {
      return await transactionRepository.get();
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
  }
};

export default transactionService;
