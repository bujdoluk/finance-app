import * as Joi from "joi";

export const isNameValid = (name: unknown, required = true): boolean => {
  const schema = required
    ? Joi.string().max(100).required()
    : Joi.string().max(100).optional();
  const { error } = schema.validate(name);
  return !error;
};

export const isAmountValid = (amount: unknown, required = true): boolean => {
  const schema = required
    ? Joi.number().positive().required()
    : Joi.number().positive().optional();
  const { error } = schema.validate(amount);
  return !error;
};

export const isNextRunValid = (next_run: unknown, required = true): boolean => {
  const schema = required
    ? Joi.string().required()
    : Joi.string().optional();
  const { error } = schema.validate(next_run);
  return !error;
};

export const isFrequencyValid = (frequency: unknown, required = false): boolean => {
  const schema = required
    ? Joi.string().valid("daily", "weekly", "monthly").required()
    : Joi.string().valid("daily", "weekly", "monthly").optional();
  const { error } = schema.validate(frequency);
  return !error;
};
