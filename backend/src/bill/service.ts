import { Bill, BillCreateBody, bills, BillUpdateBody } from "./index";

const billService = {
  createBill: (data: BillCreateBody): Bill => {
    const newBill: Bill = {
      id: bills.length ? bills[bills.length - 1].id + 1 : 1,
      ...data,
      created_at: new Date().toISOString(),
      deleted_at: false,
      updated_at: new Date().toISOString(),
    };
    bills.push(newBill);
    return newBill;
  },

  deleteBill: (id: number): Bill | undefined => {
    const bill = bills.find(b => b.id === id && !b.deleted_at);
    if (!bill) return undefined;

    bill.deleted_at = true;
    bill.updated_at = new Date().toISOString();
    return bill;
  },

  getAllBills: (): Bill[] => {
    return bills.filter(b => !b.deleted_at);
  },

  getBillById: (id: number): Bill | undefined => {
    return bills.find(b => b.id === id && !b.deleted_at);
  },

  updateBill: (id: number, data: BillUpdateBody): Bill | undefined => {
    const bill = bills.find(b => b.id === id && !b.deleted_at);
    if (!bill) return undefined;

    if (data.name !== undefined) bill.name = data.name;
    if (data.amount !== undefined) bill.amount = data.amount;
    if (data.frequency !== undefined) bill.frequency = data.frequency;
    if (data.next_run !== undefined) bill.next_run = data.next_run;

    bill.updated_at = new Date().toISOString();
    return bill;
  },
};

export default billService;
