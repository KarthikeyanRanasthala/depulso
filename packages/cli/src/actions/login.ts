import * as http from "http";
import fs from "fs";
import path from "path";

import express from "express";
import cors from "cors";
import z from "zod";
import open from "open";
import ora, { Ora } from "ora";

import { getConfigDir } from "../utils";
import { AUTH_CONFIG_FILE_NAME } from "../constants";
import { client } from "../supabase";

let spinner: Ora | null = null;

const onListen = async () => {
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:9698/",
    },
  });

  if (data.url) {
    console.log("");
    console.log("> Please visit the following URL in your web browser:");
    console.log(`> ${data.url}`);
    console.log("");

    open(data.url);

    spinner = ora({
      text: "Waiting for GitHub authentication to complete",
      spinner: "monkey",
    }).start();
  } else {
    console.error(error);
    spinner?.fail();
    process.exit(1);
  }
};

export const onLogin = async () => {
  const app = express();
  let server: http.Server | null = null;

  app.use(
    cors({
      origin: "*",
    })
  );

  app.use(express.json());

  app.use(express.json());

  const PORT = 9697;

  app.post("/callback", (req, res) => {
    const bodySchema = z.object({
      accessToken: z.string().min(1),
      refreshToken: z.string().min(1),
    });

    const body = bodySchema.parse(req.body);

    const configDir = getConfigDir();

    if (configDir) {
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(configDir, AUTH_CONFIG_FILE_NAME),
        JSON.stringify(body)
      );
    }

    res.json({});

    spinner?.succeed("Logged in successfully!");

    server?.close();
  });

  server = app.listen(PORT, onListen);
};
