import { Pot, PotCreateBody, PotDepositWithdrawBody, pots, PotUpdateBody } from "./index";

const potService = {
  createPot: (data: PotCreateBody): Pot => {
    const newPot: Pot = {
      id: pots.length ? pots[pots.length - 1].id + 1 : 1,
      ...data,
      created_at: new Date().toISOString(),
      deleted_at: false,
      updated_at: new Date().toISOString(),
    };
    pots.push(newPot);
    return newPot;
  },

  deletePot: (id: number): Pot | undefined => {
    const pot = pots.find(p => p.id === id && !p.deleted_at);
    if (!pot) return undefined;

    pot.deleted_at = true;
    pot.updated_at = new Date().toISOString();
    return pot;
  },

  depositToPot: (id: number, data: PotDepositWithdrawBody): Pot | undefined => {
    const pot = pots.find(p => p.id === id && !p.deleted_at);
    if (!pot) return undefined;

    pot.total_saved += data.amount;
    pot.updated_at = new Date().toISOString();
    return pot;
  },

  getAllPots: (): Pot[] => {
    return pots.filter(p => !p.deleted_at);
  },

  getPotById: (id: number): Pot | undefined => {
    return pots.find(p => p.id === id && !p.deleted_at);
  },

  updatePot: (id: number, data: PotUpdateBody): Pot | undefined => {
    const pot = pots.find(p => p.id === id && !p.deleted_at);
    if (!pot) return undefined;

    if (data.total_saved !== undefined) pot.total_saved = data.total_saved;
    if (data.target !== undefined) pot.target = data.target;

    pot.updated_at = new Date().toISOString();
    return pot;
  },

  withdrawFromPot: (id: number, data: PotDepositWithdrawBody): Pot | undefined => {
    const pot = pots.find(p => p.id === id && !p.deleted_at);
    if (!pot) return undefined;

    if (data.amount > pot.total_saved) return undefined;
    pot.total_saved -= data.amount;
    pot.updated_at = new Date().toISOString();
    return pot;
  },
};

export default potService;
