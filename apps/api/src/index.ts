import * as dotenv from "dotenv";
import { z } from "zod";
import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

dotenv.config();

const envSchema = z.object({
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE: z.string().min(1),
  SUPABASE_BUCKET_ID: z.string().min(1),
  WEB_ORIGIN: z.string().url(),
  MAX_DEPLOYMENT_SIZE: z.string().min(1),
  MAX_PROJECTS_LIMIT: z.string().min(1),
  PORT: z.string(),
});

export const env = envSchema.parse(process.env);

import projectsRouter from "./routes/projects";
import supabaseAuthMiddleware from "./middlewares/supabaseAuth";

const app = express();

app.use(
  cors({
    origin: env.WEB_ORIGIN,
  })
);

app.use((_, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'");
  next();
});

app.use(morgan("tiny"));
app.use(compression());

app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.json({ message: "Hello, you're hitting Depulso APIs" });
});

app.get("/config", (_: Request, res: Response) => {
  res.json({
    supabaseURL: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    maxDeploymentSize: Number(env.MAX_DEPLOYMENT_SIZE),
    maxProjectsLimit: Number(env.MAX_PROJECTS_LIMIT),
  });
});

app.use("/projects", supabaseAuthMiddleware, projectsRouter);

const server = app.listen(env.PORT, () => {
  console.log(`Listening... PORT:${env.PORT}`);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
