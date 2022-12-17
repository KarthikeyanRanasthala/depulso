import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  AUTH_ORIGIN: z.string().url(),
  MAX_DEPLOYMENT_SIZE: z.string().min(1),
});

const env = envSchema.parse(process.env);

const app = express();

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

const port = 1234;

app.listen(port, () => {
  console.log(`Listening... ${port}`);
});
