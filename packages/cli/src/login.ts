import express from "express";
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

  const PORT = 9697;

  app.listen(PORT, onListen);
};

export { onLogin };
