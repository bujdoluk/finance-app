import { Resource } from "../utils/jsonapi/resource";
import logger, { getErrorMessage } from "../utils/logger/logger";
import { PotCreateBody, PotDepositWithdrawBody, PotUpdateBody } from "./index";
import { mapToPotResource } from "./mapper";
import { potRepository } from "./repository";

export const potService = {
  createPot(data: PotCreateBody): Resource {
    try {
      const pot = potRepository.create(data);
      return mapToPotResource(pot);
    } catch (err: unknown) {
      logger.error(
        `create pot failed [total_saved=${String(data.total_saved)}]: ${getErrorMessage(err)}`
      );
      throw err;
    }
  },

  deletePot(id: number): Resource | undefined {
    try {
      const pot = potRepository.softDelete(id);
      if (!pot) {
        logger.warn(`deletePot: pot not found [potId=${String(id)}]`);
        return undefined;
      }
      return mapToPotResource(pot);
    } catch (err: unknown) {
      logger.error(`deletePot failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  deposit(id: number, body: PotDepositWithdrawBody): Resource | undefined {
    try {
      const pot = potRepository.getById(id);
      if (!pot) {
        logger.warn(`deposit failed: pot not found [potId=${String(id)}]`);
        return undefined;
      }
      pot.total_saved += body.amount;
      pot.updated_at = new Date().toISOString();
      return mapToPotResource(pot);
    } catch (err: unknown) {
      logger.error(
        `deposit failed [potId=${String(id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`
      );
      throw err;
    }
  },

  getAllPots(): Resource[] {
    try {
      return potRepository.getAll().map(mapToPotResource);
    } catch (err: unknown) {
      logger.error(`getAllPots failed: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  getPotById(id: number): Resource | undefined {
    try {
      const pot = potRepository.getById(id);
      if (!pot) {
        logger.warn(`getPotById: pot not found [potId=${String(id)}]`);
        return undefined;
      }
      return mapToPotResource(pot);
    } catch (err: unknown) {
      logger.error(`getPotById failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  updatePot(id: number, data: PotUpdateBody): Resource | undefined {
    try {
      const pot = potRepository.update(id, data);
      if (!pot) {
        logger.warn(`updatePot: pot not found [potId=${String(id)}]`);
        return undefined;
      }
      return mapToPotResource(pot);
    } catch (err: unknown) {
      logger.error(`updatePot failed [potId=${String(id)}]: ${getErrorMessage(err)}`);
      throw err;
    }
  },

  withdraw(id: number, body: PotDepositWithdrawBody): Resource | undefined {
    try {
      const pot = potRepository.getById(id);
      if (!pot) {
        logger.warn(`withdraw failed: pot not found [potId=${String(id)}]`);
        return undefined;
      }
      if (body.amount > pot.total_saved) {
        logger.warn(
          `withdraw failed: insufficient funds [potId=${String(id)}, amount=${String(body.amount)}, total_saved=${String(pot.total_saved)}]`
        );
        return undefined;
      }
      pot.total_saved -= body.amount;
      pot.updated_at = new Date().toISOString();
      return mapToPotResource(pot);
    } catch (err: unknown) {
      logger.error(
        `withdraw failed [potId=${String(id)}, amount=${String(body.amount)}]: ${getErrorMessage(err)}`
      );
      throw err;
    }
  },
};

export default potService;
