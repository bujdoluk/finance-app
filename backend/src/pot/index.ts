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

export interface PotCreateBody {
  amount: number;
  name: string;
  target: number;
  theme: string;
  total_saved: number;
}

export interface PotDepositWithdrawBody {
  amount: number;
}

export type PotUpdateBody = Partial<Pick<Pot, "target" | "total_saved">>;

export const pots: Pot[] = [
  {
    amount: 200,
    created_at: new Date().toISOString(),
    deleted_at: false,
    id: 1,
    name: "Vacation",
    target: 1000,
    theme: "blue",
    total_saved: 200,
    updated_at: new Date().toISOString()
  }
];
