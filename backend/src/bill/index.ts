export interface Bill {
  amount: number;
  created_at: string;
  deleted_at: boolean;
  frequency: "daily" | "monthly" | "weekly" | "yearly";
  id: number;
  name: string;
  next_run: string;
  updated_at: string;
}

export type BillCreateBody = Omit<
  Bill,
  "created_at" | "deleted_at" | "id" | "updated_at"
>;

export type BillUpdateBody = Partial<
  Pick<Bill, "amount" | "frequency" | "name" | "next_run">
>;

export const bills: Bill[] = [
  {
    amount: 50,
    created_at: new Date().toISOString(),
    deleted_at: false,
    frequency: "monthly",
    id: 1,
    name: "Internet",
    next_run: "2025-02-01",
    updated_at: new Date().toISOString()
  }
];
