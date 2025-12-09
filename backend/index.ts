import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from "./src/routes/index";
import swaggerUI from "swagger-ui-express";
import specs from "./src/utils/swagger/init";
import limiter from "./src/utils/rate-limit";
import hpp from "hpp";
import helmet from "helmet";
import logger from './src/utils/logger/logger';
import dotenv from 'dotenv';
// Load environment variables from .env file (just for node-pg-migrate tool)
dotenv.config();
import { dbPool } from './database/db';

const app = express();
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(limiter);
app.use(hpp());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use("/v1", router);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const port = Number(process.env.APP_PORT ?? 3001);

const server = app.listen(port, () => {
  logger.info(`API is starting on port ${port}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} signal received.`);

  const timeout = setTimeout(() => {
    console.error("Shutdown taking too long. Forcing exit...");
    process.exit(1);
  }, 3000);

  timeout.unref();

  server.close(async(): Promise<void> => {
    console.log("Closed out remaining connections");

    try {
      await dbPool.end(); 
      console.log("Postgres pool has ended");
    } catch (err: unknown) {
      console.error("Error closing Postgres pool", err);
    }

    clearTimeout(timeout); 
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));



