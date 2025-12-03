import Joi from "joi";

export const billSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .messages({
      "any.required": "Amount is required",
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be a positive integer",
    }),

  frequency: Joi.string()
    .valid("daily", "weekly", "monthly")
    .messages({
      "any.only": "Frequency must be one of: daily, weekly, monthly",
      "any.required": "Frequency is required",
      "string.base": "Frequency must be a string"
    }),

  name: Joi.string()
    .max(100)
    .messages({
      "any.required": "Name is required",
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.max": "Name cannot be longer than 100 characters",
    }),

  next_run: Joi.string()
    .messages({
      "any.required": "Next run date is required",
      "string.base": "Next run must be a valid date string",
    }),
});

export const createBillSchema = billSchema.fork(
  ["name", "amount", "next_run", "frequency"],
  (field) => field.required()
);

export const updateBillSchema = billSchema.min(1);
