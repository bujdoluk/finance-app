import { Resource } from "../utils/jsonapi/resource";
import { User } from "./index";

export const mapToUserResource = (user: User): Resource => {
  return {
    attributes: {
      created_at: user.created_at,
      deleted_at: user.deleted_at,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      updated_at: user.updated_at
    },
    id: user.id.toString(),
    links: {
      self: `/v1/users/${String(user.id)}`
    },
    type: "users"
  };
};

export default mapToUserResource;
