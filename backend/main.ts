import { Application } from "./bootstrap";

const port = Number(process.env.APP_PORT ?? 3001);
const app = new Application(port);

let isShuttingDown: boolean = false;

const gracefulShutdown = async (signal: string) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Starting graceful shutdown...`);

  const timeout = setTimeout(() => {
    console.error("Graceful shutdown timed out. Forcing exit.");
    process.exit(1);
  }, 10_000);

  timeout.unref();

  try {
    await app.stop();
    console.log("Shutdown completed cleanly.");
    process.exitCode = 0; 
  } catch (err: unknown) {
    console.error("Error during graceful shutdown:", err);
    process.exit(1);
  } finally {
    clearTimeout(timeout);
  }
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  gracefulShutdown("unhandledRejection");
});

app.start();
