import logger, { getErrorMessage } from "../utils/logger/logger";
import { Bill, bills } from "./index";

export const billRepository = {
  create(bill: Bill): Bill {
    try {
      bills.push(bill);
      return bill;
    } catch (err: unknown) {
      logger.error(`create bill failed [billId=${String(bill.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  findAll(): Bill[] {
    try {
      return bills.filter(b => !b.deleted_at);
    } catch (err: unknown) {
      logger.error(`findAll bills failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  findById(id: number): Bill | undefined {
    try {
      return bills.find(b => b.id === id && !b.deleted_at);
    } catch (err: unknown) {
      logger.error(`findById failed [billId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  softDelete(bill: Bill): Bill {
    try {
      bill.deleted_at = true;
      bill.updated_at = new Date().toISOString();
      return bill;
    } catch (err: unknown) {
      logger.error(`softDelete failed [billId=${String(bill.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  update(bill: Bill): Bill {
    try {
      bill.updated_at = new Date().toISOString();
      return bill;
    } catch (err: unknown) {
      logger.error(`update bill failed [billId=${String(bill.id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  }
};

export default billRepository;
