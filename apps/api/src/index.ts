import * as dotenv from "dotenv";
import { z } from "zod";
import express, { Request, Response } from "express";
import cors from "cors";

dotenv.config();

const envSchema = z.object({
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE: z.string().min(1),
  SUPABASE_BUCKET_ID: z.string().min(1),
  AUTH_ORIGIN: z.string().url(),
  API_ORIGIN: z.string().url(),
  WEB_ORIGIN: z.string().url(),
  MAX_DEPLOYMENT_SIZE: z.string().min(1),
  PORT: z.string(),
});

export const env = envSchema.parse(process.env);

import projectsRouter from "./routes/projects";
import supabaseAuthMiddleware from "./middlewares/supabaseAuth";

const app = express();

if (env.WEB_ORIGIN) {
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
    })
  );
}

app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.json({ message: "Hello, you're hitting Depulso APIs" });
});

app.get("/config", (_: Request, res: Response) => {
  res.json({
    supabaseURL: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    maxDeploymentSize: env.MAX_DEPLOYMENT_SIZE,
  });
});

app.use("/projects", supabaseAuthMiddleware, projectsRouter);

app.listen(env.PORT, () => {
  console.log(`Listening... ${env.PORT}`);
});
