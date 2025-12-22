import { TransactionsInput } from "@db/dbSchema";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";

import { joiToErrors } from "../utils/jsonapi/error";

const transactionSchema = Joi.object({
  amount: Joi.number().required().positive(),
  category: Joi.string().required(),
  transaction_type: Joi.string().valid("income", "expense").required(),
  date: Joi.string().isoDate().required(),
  sender: Joi.string().required(),
  sender_picture: Joi.string().required(),
});

export const createTransactionSchema = transactionSchema; 

export const validateCreateTransaction = (body: TransactionsInput) => {
  const result = createTransactionSchema.validate(body, { abortEarly: false });
  if (result.error) return joiToErrors(result.error.details, StatusCodes.BAD_REQUEST);
  return null;
};
