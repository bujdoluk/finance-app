
import { Pool } from "pg";

export const dbPool: Pool = new Pool({
  connectionTimeoutMillis: 5000,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  idleTimeoutMillis: 30000,
  max: 20,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER
});