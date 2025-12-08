import { Pots, PotsInput } from "../../database/dbSchema";
import logger, { getErrorMessage } from "../utils/logger/logger";
import potRepository  from "./repository";
import { validateDepositAmount } from "./validation";

export const potService = {
  async create(body: PotsInput): Promise<Pots> {
    try {
      const pot = await potRepository.create(body);
      return pot;
    } catch (err: unknown) {
      logger.error(`createPot error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async delete(id: number): Promise<null | Pots> {
    try {
      const pot = await potRepository.getById(id);
      if (!pot) return null;
      return await potRepository.delete(id);
    } catch (err: unknown) {
      logger.error(`deletePot error [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async deposit(id: number, body: PotsInput): Promise<null | Pots> {
    try {
      const validationErrors = validateDepositAmount(body);
      if (validationErrors) {
        throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
      }

      const existing = await potRepository.getById(id);
      if (!existing) return null;

      const { amount } = body;
      if (amount === undefined) {
        throw new Error("Amount is missing after validation");
      }

      return await potRepository.update(id, {
        ...existing,
        total_saved: existing.total_saved + amount,
      });
    } catch (err: unknown) {
      logger.error(`deposit error [id=${String(id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async get(): Promise<Pots[]> {
    try {
      return await potRepository.get();
    } catch (err: unknown) {
      logger.error(`getAllPots error: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async getById(id: number): Promise<null | Pots> {
    try {
      return await potRepository.getById(id);
    } catch (err: unknown) {
      logger.error(`getPotById error [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
 async updatePot(id: number, body: PotsInput): Promise<null | Pots> {
    try {
      const existingPot = await potRepository.getById(id);
      if (!existingPot) return null;
      return await potRepository.update(id, { ...existingPot, ...body });
    } catch (err: unknown) {
      logger.error(`updatePot error [id=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async withdraw(id: number, body: PotsInput): Promise<null | Pots> {
    try {
      const validationErrors = validateDepositAmount(body);
      if (validationErrors) {
        throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
      }

      const existing = await potRepository.getById(id);
      if (!existing) return null;

      const { amount } = body;
      if (amount === undefined) {
        throw new Error("Amount is missing after validation");
      }

      if (existing.total_saved < amount) {
        return null; 
      }

      return await potRepository.update(id, {
        ...existing,
        total_saved: existing.total_saved - amount,
      });
    } catch (err: unknown) {
      logger.error(`withdraw error [id=${String(id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};


export default potService;
