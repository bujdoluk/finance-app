export interface User {
  created_at: string;
  deleted_at: boolean;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  password: string;
  updated_at: string;
};

export interface UserCreateBody {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export interface UserUpdateBody {
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
};

export const users: User[] = [
  {
    created_at: new Date().toISOString(),
    deleted_at: false,
    email: "john@example.com",
    first_name: "John",
    id: 1,
    last_name: "Doe",
    password: "password123",
    updated_at: new Date().toISOString()
  },
  {
    created_at: new Date().toISOString(),
    deleted_at: false,
    email: "jane@example.com",
    first_name: "Jane",
    id: 2,
    last_name: "Smith",
    password: "secret",
    updated_at: new Date().toISOString()
  }
];
