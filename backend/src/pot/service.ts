import { Pots, PotsInput } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";
import potRepository  from "./repository";

export const potService = {
  async createPot(body: PotsInput): Promise<Pots> {
    try {
      const pot = await potRepository.create(body);
      return pot;
    } catch (err: unknown) {
      logger.error(`createPot error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deletePot(id: number): Promise<null | Pots> {
    try {
      const pot = await potRepository.findById(id);
      if (!pot) return null;
      return await potRepository.softDelete(id);
    } catch (err: unknown) {
      logger.error(`deletePot error [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deposit(id: number, body: PostInput): Promise<null | Pots> {
    try {
      const existing = await potRepository.findById(id);
      if (!existing) return null;
      return await potRepository.update(id, { ...existing, total_saved: existing.total_saved + body.amount });
    } catch (err: unknown) {
      logger.error(`deposit error [id=${String(id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getAllPots(): Promise<Pots[]> {
    try {
      return await potRepository.findAll();
    } catch (err: unknown) {
      logger.error(`getAllPots error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getPotById(id: number): Promise<null | Pots> {
    try {
      return await potRepository.findById(id);
    } catch (err: unknown) {
      logger.error(`getPotById error [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async updatePot(id: number, body: PotsInput): Promise<null | Pots> {
    try {
      const existingPot = await potRepository.findById(id);
      if (!existingPot) return null;
      return await potRepository.update(id, { ...existingPot, ...body });
    } catch (err: unknown) {
      logger.error(`updatePot error [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async withdraw(id: number, body: { amount: number }): Promise<null | Pots> {
    try {
      const existing = await potRepository.findById(id);
      if (!existing) return null;
      if (body.amount > existing.total_saved) {
        logger.warn(`withdraw failed: insufficient funds [id=${String(id)}, requested=${String(body.amount)}, available=${String(existing.total_saved)}]`);
        return null;
      }
      return await potRepository.update(id, { ...existing, total_saved: existing.total_saved - body.amount });
    } catch (err: unknown) {
      logger.error(`withdraw error [id=${String(id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  }
};

export default potService;
