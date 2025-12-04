import { Resource } from "../utils/jsonapi/resource";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { Bill } from "./index";
import { mapToBillResource } from "./mapper";
import billRepository from "./repository";

export type BillCreateData = Pick<Bill, "amount" | "frequency" | "name" | "next_run">;

const billService = {
  createBill(body: BillCreateData): Resource {
    try {
      const allBills = billRepository.findAll();
      const nextId = allBills.length ? allBills[allBills.length - 1].id + 1 : 1;

      const newBill: Bill = {
        ...body,
        created_at: new Date().toISOString(),
        deleted_at: false,
        id: nextId,
        updated_at: new Date().toISOString(),
      };

      const created = billRepository.create(newBill);
      return mapToBillResource(created);
    } catch (err: unknown) {
      logger.error(`createBill failed [name=${body.name}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  deleteBill(id: number): Resource | undefined {
    try {
      const bill = billRepository.findById(id);
      if (!bill) return undefined;

      const deleted = billRepository.softDelete(bill);
      return mapToBillResource(deleted);
    } catch (err: unknown) {
      logger.error(`deleteBill failed [billId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getAllBills(): Resource[] {
    try {
      return billRepository.findAll().map(mapToBillResource);
    } catch (err: unknown) {
      logger.error(`getAllBills failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getBillById(id: number): Resource | undefined {
    try {
      const bill = billRepository.findById(id);
      return bill ? mapToBillResource(bill) : undefined;
    } catch (err: unknown) {
      logger.error(`getBillById failed [billId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  updateBill(id: number, body: Partial<Bill>): Resource | undefined {
    try {
      const bill = billRepository.findById(id);
      if (!bill) return undefined;

      Object.assign(bill, body);
      bill.updated_at = new Date().toISOString();

      const updated = billRepository.update(bill);
      return mapToBillResource(updated);
    } catch (err: unknown) {
      logger.error(`updateBill failed [billId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  }
};

export default billService;
