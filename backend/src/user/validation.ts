import Joi from "joi";

import { UsersInput } from "../../database/dbSchema";

export const createUserSchema = Joi.object<UsersInput>({
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object<UsersInput>({
  email: Joi.string().email().optional(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  password: Joi.string().optional(),
}).min(1); 
