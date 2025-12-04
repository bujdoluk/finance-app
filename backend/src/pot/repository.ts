import logger, { getErrorMessage } from "../utils/logger/logger";
import { Pot, PotCreateBody, pots, PotUpdateBody } from "./index";

export const potRepository = {
  create(data: PotCreateBody): Pot {
    try {
      const newPot: Pot = {
        ...data,
        created_at: new Date().toISOString(),
        deleted_at: false,
        id: pots.length ? pots[pots.length - 1].id + 1 : 1,
        total_saved: data.total_saved,
        updated_at: new Date().toISOString(),
      };
      pots.push(newPot);
      return newPot;
    } catch (err: unknown) {
      logger.error(`create pot failed [data=${JSON.stringify(data)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getAll(): Pot[] {
    try {
      return pots.filter(p => !p.deleted_at);
    } catch (err: unknown) {
      logger.error(`get all pots failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getById(id: number): Pot | undefined {
    try {
      return pots.find(p => p.id === id && !p.deleted_at);
    } catch (err: unknown) {
      logger.error(`get pot by id failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  softDelete(id: number): Pot | undefined {
    try {
      const pot = pots.find(p => p.id === id && !p.deleted_at);
      if (!pot) {
        logger.warn(`soft delete pot failed: pot not found [potId=${String(id)}]`);
        return undefined;
      }
      pot.deleted_at = true;
      pot.updated_at = new Date().toISOString();
      return pot;
    } catch (err: unknown) {
      logger.error(`soft delete pot failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  update(id: number, data: PotUpdateBody): Pot | undefined {
    try {
      const pot = pots.find(p => p.id === id && !p.deleted_at);
      if (!pot) {
        logger.warn(`update pot failed: pot not found [potId=${String(id)}]`);
        return undefined;
      }
      Object.assign(pot, data);
      pot.updated_at = new Date().toISOString();
      return pot;
    } catch (err: unknown) {
      logger.error(`update pot failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  }
};

export default potRepository;
