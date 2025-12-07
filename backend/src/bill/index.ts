export interface Bill {
  amount: number;
  created_at: string;
  deleted_at: string;
  frequency?: string;
  id: number;
  name: string;
  next_run: string;
  updated_at: string;
}

export const bills: Bill[] = [];
