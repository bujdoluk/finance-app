export interface Transaction {
  amount: number;
  category: string;
  created_at: string;
  date: string;
  deleted_at: string;
  id: number;
  sender: string;
  sender_picture: string;
  updated_at: string;
}

export interface TransactionCreateBody {
  amount: number;
  category: string;
  date: string;
  sender: string;
  sender_picture: string;
}

export const transactions: Transaction[] = [];
