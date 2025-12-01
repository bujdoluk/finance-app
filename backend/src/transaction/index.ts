export interface Transaction {
  amount: number;
  category: string;
  created_at: string;
  date: string;
  deleted_at: boolean;
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

export const transactions: Transaction[] = [
  {
    amount: 25.50,
    category: 'Food',
    created_at: '2025-01-01T10:00:00Z',
    date: '2025-01-01',
    deleted_at: false,
    id: 1,
    sender: 'Alice',
    sender_picture: "some url where picture is stored",
    updated_at: '2025-01-01T10:00:00Z'
  },
  {
    amount: 15.75,
    category: 'Transport',
    created_at: '2025-01-02T12:30:00Z',
    date: '2025-01-02',
    deleted_at: false,
    id: 2,
    sender: 'Bob',
    sender_picture: "some url where picture is stored",
    updated_at: '2025-01-02T12:30:00Z'
  }
];
