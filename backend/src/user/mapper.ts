/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { QueryResult } from "pg";

import { Resource } from "../utils/jsonapi/resource";
import { User } from "./index";

/**
 * Type guard to check if object is a QueryResult<User>
 */
function isQueryResult(res: any): res is QueryResult<User> {
  return res && typeof res === "object" && "rows" in res && Array.isArray(res.rows);
}

/**
 * Map database rows to User interface.
 * Can handle:
 *  - QueryResult<User>
 *  - Array of User rows
 *  - Single User object
 */
export const mapDbUser = (res: QueryResult<User> | User | User[]): User[] => {
  let rows: User[];

  if (isQueryResult(res)) {
    // It's a QueryResult<User>
    rows = res.rows;
  } else if (Array.isArray(res)) {
    // It's already an array of User
    rows = res;
  } else {
    // Single User object
    rows = [res];
  }

  return rows.map((row) => ({
    created_at: row.created_at,
    deleted_at: row.deleted_at,
    email: row.email,
    first_name: row.first_name,
    id: row.id,
    last_name: row.last_name,
    password: row.password,
    updated_at: row.updated_at,
  }));
};

/**
 * Map a User interface to a JSON:API Resource
 */
export const mapToUserResource = (user: User): Resource => ({
  attributes: {
    created_at: user.created_at,
    deleted_at: user.deleted_at,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    updated_at: user.updated_at,
  },
  id: String(user.id),
  links: {
    self: `/v1/users/${String(user.id)}`,
  },
  type: "users",
});

export default {
  mapDbUser,
  mapToUserResource,
};