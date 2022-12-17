import { NextFunction, Request, Response } from "express";
import { env } from "..";
import { admin } from "../lib/supabaseAdmin";

const supabaseAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers?.authorization?.split(" ") || [];

  if (header[0] !== "Bearer" || !header[1]?.length) {
    res.sendStatus(403);
    return;
  }

  const { data, error } = await admin.auth.getUser(header[1]);

  if (error) {
    res.sendStatus(403);
  }

  res.locals.user = data.user;

  next();
};

export default supabaseAuth;
