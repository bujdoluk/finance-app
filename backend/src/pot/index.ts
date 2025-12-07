export interface Pot {
  amount: number;
  created_at: string;
  deleted_at: string;
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

export const pots: Pot[] = [];
