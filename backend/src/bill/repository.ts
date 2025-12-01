import { Bill, bills } from "./index";

export const billRepository = {
  create(bill: Bill): Bill {
    bills.push(bill);
    return bill;
  },

  findAll(): Bill[] {
    return bills.filter(b => !b.deleted_at);
  },

  findById(id: number): Bill | undefined {
    return bills.find(b => b.id === id && !b.deleted_at);
  },

  softDelete(bill: Bill): Bill {
    bill.deleted_at = true;
    bill.updated_at = new Date().toISOString();
    return bill;
  },

  update(bill: Bill): Bill {
    return bill;
  }
};

export default billRepository;
