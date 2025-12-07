import { Users } from "../../database/dbSchema";
import { Resource } from "../utils/jsonapi/resource";

/**
 * Map a User type interface to a JSON:API Resource
 */
export const mapToUserResource = (user: Users): Resource => ({
  attributes: {
    created_at: user.created_at,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  },
  id: String(user.id),
  links: {
    self: `/v1/users/${String(user.id)}`,
  },
  type: "users",
});
