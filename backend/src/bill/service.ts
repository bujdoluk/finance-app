import { Resource } from "../utils/jsonapi/resource";
import { Bill, BillCreateBody, BillUpdateBody } from "./index";
import { mapToBillResource } from "./mapper";
import billRepository from "./repository";

const billService = {
  createBill(body: BillCreateBody): Resource {
    const allBills = billRepository.findAll();
    const nextId = allBills.length ? allBills[allBills.length - 1].id + 1 : 1;

    const newBill: Bill = {
      ...body,
      created_at: new Date().toISOString(),
      deleted_at: false,
      id: nextId,
      updated_at: new Date().toISOString()
    };

    const created = billRepository.create(newBill);
    return mapToBillResource(created);
  },

  deleteBill(id: number): Resource | undefined {
    const bill = billRepository.findById(id);
    if (!bill) return undefined;

    const deleted = billRepository.softDelete(bill);
    return mapToBillResource(deleted);
  },

  getAllBills(): Resource[] {
    return billRepository.findAll().map(mapToBillResource);
  },

  getBillById(id: number): Resource | undefined {
    const bill = billRepository.findById(id);
    return bill ? mapToBillResource(bill) : undefined;
  },

  updateBill(id: number, body: BillUpdateBody): Resource | undefined {
    const bill = billRepository.findById(id);
    if (!bill) return undefined;

    Object.assign(bill, body);
    bill.updated_at = new Date().toISOString();

    const updated = billRepository.update(bill);
    return mapToBillResource(updated);
  }
};

export default billService;
