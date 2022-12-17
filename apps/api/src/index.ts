import express, { Request, Response } from "express";

const app = express();

app.get("/", (_: Request, res: Response) => {
  res.json({ message: "Hello, API!" });
});

const port = 1234;

app.listen(port, () => {
  console.log(`Listening... ${port}`);
});
