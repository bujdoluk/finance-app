import type { Knex } from "knex";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "user123",
    password: process.env.DB_PASSWORD || "password123",
    database: process.env.DB_NAME || "db123",
  },
  migrations: {
    directory: path.join(__dirname, "migrations"),
    extension: "ts",
  },
  seeds: {
    directory: path.join(__dirname, "seeds"),
    extension: "ts",
  },
};

export default config;
