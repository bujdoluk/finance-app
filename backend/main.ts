import { Application } from "./bootstrap";

const port = Number(process.env.APP_PORT ?? 3001);
const app = new Application(port);

const shutdown = async (signal: string) => {
  console.log(`${signal} signal received.`);

  const timeout = setTimeout(() => {
    console.error("Shutdown taking too long. Forcing exit...");
    process.exit(1);
  }, 3000);

  timeout.unref();

  await app.stop();
  clearTimeout(timeout);
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

app.start();
