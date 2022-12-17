import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

dotenv.config();

const envSchema = z.object({
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE: z.string().min(1),
  SUPABASE_BUCKET_ID: z.string().min(1),
  AUTH_ORIGIN: z.string().url(),
  MAX_DEPLOYMENT_SIZE: z.string().min(1),
});

const env = envSchema.parse(process.env);

const app = express();

// TODO: Add CORS

const client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
  auth: {
    persistSession: false,
  },
});

const emptyFolderPlaceholder = ".emptyFolderPlaceholder";

app.get("/", (_: Request, res: Response) => {
  res.json({ message: "Hello, API!" });
});

app.get("/config", (_: Request, res: Response) => {
  res.json({
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    supabaseURL: env.SUPABASE_URL,
    authOrigin: env.AUTH_ORIGIN,
    maxDeploymentSize: env.MAX_DEPLOYMENT_SIZE,
  });
});

const getUniqueName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: "-",
    length: 3,
  });

app.get("/project/suggestion", async (_: Request, res: Response) => {
  let count = 0;

  while (count < 5) {
    const suggestion = getUniqueName();

    const { data, error } = await client.storage
      .from(env.SUPABASE_BUCKET_ID)
      .list(suggestion, {
        search: emptyFolderPlaceholder,
      });

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      res.json({ key: suggestion });
      return;
    }

    count++;
  }

  res.sendStatus(500);
});

const port = 1234;

app.listen(port, () => {
  console.log(`Listening... ${port}`);
});
