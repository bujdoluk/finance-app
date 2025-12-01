import {
  Pot,
  PotCreateBody,
  PotDepositWithdrawBody,
  PotUpdateBody
} from "./index";
import { potRepository } from "./repository";

export const potService = {
  createPot(data: PotCreateBody): Pot {
    return potRepository.create(data);
  },

  deletePot(id: number): Pot | undefined {
    return potRepository.softDelete(id);
  },

  deposit(id: number, body: PotDepositWithdrawBody): Pot | undefined {
    const pot = potRepository.getById(id);
    if (!pot) return;

    pot.total_saved += body.amount;
    pot.updated_at = new Date().toISOString();

    return pot;
  },

  getAllPots(): Pot[] {
    return potRepository.getAll();
  },

  getPotById(id: number): Pot | undefined {
    return potRepository.getById(id);
  },

  updatePot(id: number, data: PotUpdateBody): Pot | undefined {
    return potRepository.update(id, data);
  },

  withdraw(id: number, body: PotDepositWithdrawBody): Pot | undefined {
    const pot = potRepository.getById(id);
    if (!pot) return;

    if (body.amount > pot.total_saved) return;

    pot.total_saved -= body.amount;
    pot.updated_at = new Date().toISOString();

    return pot;
  }
};
