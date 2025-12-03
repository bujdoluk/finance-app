import Joi from "joi";

import { UserCreateBody, UserUpdateBody } from "./index";

export const createUserSchema = Joi.object<UserCreateBody>({
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object<UserUpdateBody>({
  email: Joi.string().email().optional(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  password: Joi.string().optional(),
}).min(1); 
