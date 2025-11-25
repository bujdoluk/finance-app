import express from 'express';

const app = express();

const port = process.env.APP_PORT ?? process.env.PORT ?? "9001";

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});