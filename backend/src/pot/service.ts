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
      return await potRepository.deleteWithRefund(id);
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

      const amount = body.amount;
      if (amount === undefined) {
        throw new Error("Amount is missing after validation");
      }

      return await potRepository.deposit(id, amount);
    } catch (err: unknown) {
      logger.error(`deposit error [id=${String(id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  async get(query?: Record<string, unknown>): Promise<{ rows: Pots[]; total: number }> {
    try {
      return await potRepository.get(query);
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

  async withdraw(id: number, body: PotsInput): Promise<null | Pots> {
    try {
      const validationErrors = validateDepositAmount(body);
      if (validationErrors) {
        throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
      }

      const amount = body.amount;
      if (amount === undefined) {
        throw new Error("Amount is missing after validation");
      }

      return await potRepository.withdraw(id, amount);
    } catch (err: unknown) {
      logger.error(`withdraw error [id=${String(id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },
};


export default potService;
