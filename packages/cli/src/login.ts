import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import open from "open";

import { client } from "./supabase";

const onListen = async () => {
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "github",
  });

  if (data.url) {
    open(data.url);
  } else {
    console.error(error);
    process.exit(1);
  }
};

const onLogin = () => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:9698",
    })
  );

  app.use(bodyParser.json());

  const PORT = 9697;

  app.post("/credentials", (req, res) => {
    console.log({ body: req.body });

    res.json({});
  });

  app.listen(PORT, onListen);
};

export { onLogin };
