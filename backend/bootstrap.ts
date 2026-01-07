import { Server } from "http";
import { dbPool } from "./database/db";
import createServer from "././server";
import logger from "./src/utils/logger/logger";

export class Application {
  private server: Server | null = null;
  private port: number;

  constructor(port: number) {
    this.port = port;
  }

  async start(): Promise<void> {
    logger.info("Starting application bootstrap...");

    try {
      logger.info("Connecting to database...");
      await dbPool.query("SELECT 1");
      logger.info("Database connected.");

      const app = createServer();
      this.server = app.listen(this.port);

      await new Promise<void>((resolve) => {
        this.server?.on("listening", resolve);
      });

      logger.info(`Server is ready and listening on port ${this.port}`);
    } catch (err: unknown) {
      logger.error("FATAL: Application failed to start.", err);
      await this.stop();
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    logger.info("Shutting down application...");

    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(async () => {
          logger.info("HTTP server closed.");

          try {
            await dbPool.end();
            logger.info("Postgres pool has ended.");
          } catch (err: unknown) {
            logger.error("Error closing Postgres pool", err);
          }

          resolve();
        });
      });
    }
  }
}