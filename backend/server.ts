import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import swaggerUI from "swagger-ui-express";
import router from "./src/routes";
import specs from "./src/utils/swagger/init";

export default function createServer() {
  const app = express();

  app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }));

  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  // app.use(helmet());

  app.use("/v1", router);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

  return app;
}
