import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3001;

app.use(express.json());
app.use(cors);

app.listen(port, () => {
    console.log("Server is runnign on port 3000");
});