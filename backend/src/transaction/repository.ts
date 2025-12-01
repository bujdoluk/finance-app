import { Transaction, transactions } from "./index";

export const transactionRepository = {
  create(transaction: Transaction): Transaction {
    transactions.push(transaction);
    return transaction;
  },

  findAll(): Transaction[] {
    return transactions.filter(t => !t.deleted_at);
  },

  findById(id: number): Transaction | undefined {
    return transactions.find(t => t.id === id && !t.deleted_at);
  },

  softDelete(transaction: Transaction): Transaction {
    return transaction;
  },

  update(transaction: Transaction): Transaction {
    return transaction; 
  }
};

export default transactionRepository;
