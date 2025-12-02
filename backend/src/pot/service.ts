import { Resource } from "../utils/jsonapi/resource";
import { PotCreateBody, PotDepositWithdrawBody, PotUpdateBody } from "./index";
import { mapToPotResource } from "./mapper";
import { potRepository } from "./repository";

export const potService = {
  createPot(data: PotCreateBody): Resource {
    const pot = potRepository.create(data);
    return mapToPotResource(pot);
  },

  deletePot(id: number): Resource | undefined {
    const pot = potRepository.softDelete(id);
    return pot ? mapToPotResource(pot) : undefined;
  },

  deposit(id: number, body: PotDepositWithdrawBody): Resource | undefined {
    const pot = potRepository.getById(id);
    if (!pot) return undefined;
    pot.total_saved += body.amount;
    pot.updated_at = new Date().toISOString();
    return mapToPotResource(pot);
  },

  getAllPots(): Resource[] {
    return potRepository.getAll().map(mapToPotResource);
  },

  getPotById(id: number): Resource | undefined {
    const pot = potRepository.getById(id);
    return pot ? mapToPotResource(pot) : undefined;
  },

  updatePot(id: number, data: PotUpdateBody): Resource | undefined {
    const pot = potRepository.update(id, data);
    return pot ? mapToPotResource(pot) : undefined;
  },

  withdraw(id: number, body: PotDepositWithdrawBody): Resource | undefined {
    const pot = potRepository.getById(id);
    if (!pot || body.amount > pot.total_saved) return undefined;
    pot.total_saved -= body.amount;
    pot.updated_at = new Date().toISOString();
    return mapToPotResource(pot);
  }
};
