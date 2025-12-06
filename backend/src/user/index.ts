export interface User {
  created_at: string;
  deleted_at: null | string;
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
