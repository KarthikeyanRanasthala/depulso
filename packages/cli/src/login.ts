import fs from "fs";
import path from "path";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import open from "open";

import { client } from "./supabase";
import { AUTH_CONFIG_FILE_NAME } from "./constants";
import { getConfigDir } from "./utils";

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

export const onLogin = () => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:9698",
    })
  );

  app.use(bodyParser.json());

  const PORT = 9697;

  app.post("/credentials", (req, res) => {
    const configDir = getConfigDir();

    if (configDir) {
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(configDir, AUTH_CONFIG_FILE_NAME),
        JSON.stringify(req.body)
      );
    }

    res.json({});
  });

  app.listen(PORT, onListen);
};
