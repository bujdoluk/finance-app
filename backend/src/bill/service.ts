import { Bill, BillCreateBody, BillUpdateBody } from "./index";
import mapToBillEntity from "./mapper";
import billRepository from "./repository";

const billService = {
  createBill(body: BillCreateBody): Bill {
    const allBills = billRepository.findAll();
    const nextId = allBills.length ? allBills[allBills.length - 1].id + 1 : 1;

    const newBill: Bill = {
      amount: body.amount,
      created_at: new Date().toISOString(),
      deleted_at: false,
      frequency: body.frequency,
      id: nextId,
      name: body.name,
      next_run: body.next_run,
      updated_at: new Date().toISOString(),
    };

    return mapToBillEntity(billRepository.create(newBill));
  },

  deleteBill(id: number): Bill | undefined {
    const bill = billRepository.findById(id);
    if (!bill) return undefined;

    return mapToBillEntity(billRepository.softDelete(bill));
  },

  getAllBills(): Bill[] {
    return billRepository.findAll().map(mapToBillEntity);
  },

  getBillById(id: number): Bill | undefined {
    const bill = billRepository.findById(id);
    return bill ? mapToBillEntity(bill) : undefined;
  },

  updateBill(id: number, body: BillUpdateBody): Bill | undefined {
    const bill = billRepository.findById(id);
    if (!bill) return undefined;

    if (body.name !== undefined) bill.name = body.name;
    if (body.amount !== undefined) bill.amount = body.amount;
    if (body.frequency !== undefined) bill.frequency = body.frequency;
    if (body.next_run !== undefined) bill.next_run = body.next_run;

    bill.updated_at = new Date().toISOString();

    return mapToBillEntity(billRepository.update(bill));
  },
};

export default billService;
