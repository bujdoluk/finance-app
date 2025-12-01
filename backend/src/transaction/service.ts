import { Transaction, TransactionCreateBody, transactions } from "./index";

const transactionService = {
  createTransaction: (data: TransactionCreateBody): Transaction => {
    const newTransaction: Transaction = {
      id: transactions.length ? transactions[transactions.length - 1].id + 1 : 1,
      ...data,
      created_at: new Date().toISOString(),
      deleted_at: false,
      updated_at: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    return newTransaction;
  },

  deleteTransaction: (id: number): Transaction | undefined => {
    const transaction = transactions.find(t => t.id === id && !t.deleted_at);
    if (!transaction) return undefined;

    transaction.deleted_at = true;
    transaction.updated_at = new Date().toISOString();
    return transaction;
  },

  getAllTransactions: (): Transaction[] => {
    return transactions.filter(t => !t.deleted_at);
  },

  getTransactionById: (id: number): Transaction | undefined => {
    return transactions.find(t => t.id === id && !t.deleted_at);
  },
};

export default transactionService;
