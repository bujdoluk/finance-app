export interface Pot {
  amount: number;
  created_at: string;
  deleted_at: boolean;
  id: number;
  name: string;
  target: number;
  theme: string;
  total_saved: number;
  updated_at: string;
}

export type PotCreateBody = Omit<Pot, "created_at" | "deleted_at" | "id" | "updated_at">;
export interface PotDepositWithdrawBody { amount: number };
export type PotUpdateBody = Partial<Pick<Pot, "target" | "total_saved">>;

export const pots: Pot[] = [
  {
    amount: 500,
    created_at: new Date().toISOString(),
    deleted_at: false,
    id: 1,
    name: "Car",
    target: 500,
    theme: "green",
    total_saved: 100,
    updated_at: new Date().toISOString(),
  },
];
