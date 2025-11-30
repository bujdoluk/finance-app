import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import os from "os";
import router from "./src/routes/routes";

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use("/v1", router);

const port = Number(process.env.APP_PORT ?? process.env.PORT ?? "9001");

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


