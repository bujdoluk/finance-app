export interface Bill {
  amount: number;
  created_at: string;
  deleted_at: boolean;
  frequency?: string;
  id: number;
  name: string;
  next_run: string;
  updated_at: string;
}

export interface BillCreateBody {
  amount: number;
  frequency?: string;
  name: string;
  next_run: string;
}

export type BillUpdateBody = Partial<BillCreateBody>;

export const bills: Bill[] = [
  {
    amount: 100,
    created_at: new Date().toISOString(),
    deleted_at: false,
    frequency: "monthly",
    id: 1,
    name: "Electricity",
    next_run: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    amount: 50,
    created_at: new Date().toISOString(),
    deleted_at: false,
    frequency: "monthly",
    id: 2,
    name: "Internet",
    next_run: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
