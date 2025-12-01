import { User } from "./index";

export const mapToUserEntity = (user: User) => ({
  created_at: user.created_at,
  deleted_at: user.deleted_at,
  email: user.email,
  first_name: user.first_name,
  id: user.id,
  last_name: user.last_name,
  updated_at: user.updated_at
});

export default mapToUserEntity;
