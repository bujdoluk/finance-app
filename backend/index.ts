import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import os from "os";
import router from "./src/routes/routes";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use("/v1", router);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance API",
      version: "1.0.0",
      description: "A simple personal finance tracking API"
    },
    servers: [
      {
        url: "http://localhost:3001"
      }
    ]
  },
  apis: ["./src/user/user-controller.ts"]
}

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const port = Number(process.env.APP_PORT ?? process.env.PORT ?? "9001");

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


