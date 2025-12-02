import { Pot, PotCreateBody, pots, PotUpdateBody } from "./index";

export const potRepository = {
  create(data: PotCreateBody): Pot {
    const newPot: Pot = {
      ...data,
      created_at: new Date().toISOString(),
      deleted_at: false,
      id: pots.length ? pots[pots.length - 1].id + 1 : 1,
      total_saved: data.total_saved,
      updated_at: new Date().toISOString()
    };
    pots.push(newPot);
    return newPot;
  },

  getAll(): Pot[] {
    return pots.filter(p => !p.deleted_at);
  },

  getById(id: number): Pot | undefined {
    return pots.find(p => p.id === id && !p.deleted_at);
  },

  softDelete(id: number): Pot | undefined {
    const pot = pots.find(p => p.id === id && !p.deleted_at);
    if (!pot) return;
    pot.deleted_at = true;
    pot.updated_at = new Date().toISOString();
    return pot;
  },

  update(id: number, data: PotUpdateBody): Pot | undefined {
    const pot = pots.find(p => p.id === id && !p.deleted_at);
    if (!pot) return;
    Object.assign(pot, data);
    pot.updated_at = new Date().toISOString();
    return pot;
  }
};

export default potRepository;
