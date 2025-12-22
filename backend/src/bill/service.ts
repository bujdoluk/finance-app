import { Bills, BillsInput } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";
import billRepository from "./repository";

export const billService = {
  async create(body: BillsInput): Promise<Bills> {
    try {
      return await billRepository.create(body);
    } catch (err: unknown) {
      logger.error(`createBill error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async delete(id: number): Promise<Bills | null> {
    try {
      const existing = await billRepository.getById(id);
      if (!existing) return null;
      return await billRepository.delete(id);
    } catch (err: unknown) {
      logger.error(`deleteBill error [billId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async get(query?: Record<string, unknown>): Promise<{ rows: Bills[], total: number}> {
    try {
      return await billRepository.get(query);
    } catch (err: unknown) {
      logger.error(`getAllBills error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getById(id: number): Promise<Bills | null> {
    try {
      return await billRepository.getById(id);
    } catch (err: unknown) {
      logger.error(`getBillById error [billId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async update(id: number, body: BillsInput): Promise<Bills | null> {
    try {
      const existing = await billRepository.getById(id);
      if (!existing) return null;
      return await billRepository.update(id, { ...existing, ...body });
    } catch (err: unknown) {
      logger.error(`updateBill error [billId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};

export default billService;
