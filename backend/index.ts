import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from "./src/routes/index";
import swaggerUI from "swagger-ui-express";
import specs from "./src/utils/swagger/init";

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use("/v1", router);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const port = Number(process.env.APP_PORT ?? process.env.PORT ?? "9001");

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} signal received.`);

  const timeout = setTimeout(() => {
    console.error("Shutdown taking too long. Forcing exit...");
    process.exit(1);
  }, 3000);

  timeout.unref();

  server.close(() => {
    console.log("Closed out remaining connections");

    // Additional cleanup tasks (DB, queues, files, etc.)
    // await prisma.$disconnect();
    // mongoose.disconnect();
    // redis.quit();

    clearTimeout(timeout); 
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));



