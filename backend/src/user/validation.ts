import { UserCreateBody, UserUpdateBody } from "./index";

export const validateCreateUser = (data: UserCreateBody) => {
  const { email, first_name, last_name, password } = data;
  if (!first_name || !last_name || !email || !password) {
    return "All fields are required";
  }
  return null; 
};

export const validateUpdateUser = (data: UserUpdateBody) => {
  if (!data.first_name && !data.last_name && !data.email && !data.password) {
    return "At least one field must be provided";
  }
  return null; 
};