import { Request, Response, Router } from "express";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

import { env } from "..";
import { admin, storageAdmin } from "../lib/supabaseAdmin";
import constants from "../constants";
import { z } from "zod";
import type { User } from "@supabase/supabase-js";

const router = Router();

const generateProjectName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: "-",
    length: 3,
  });

const canCreateProject = async (requestQuery: unknown) => {
  const querySchema = z.object({
    name: z.string().min(4),
  });

  const query = querySchema.parse(requestQuery);

  const { data, error } = await admin.storage
    .from(env.SUPABASE_BUCKET_ID)
    .list(query.name, {
      search: constants.emptyFolderPlaceholder,
    });

  if (error) {
    throw new Error(error.message);
  }

  if (data.length === 0) {
    return true;
  }

  return false;
};

router.post("/", async (req: Request, res: Response) => {
  const canCreate = await canCreateProject(req.body);

  if (!canCreate) {
    res.sendStatus(400);
    return;
  }

  const path = `${req.body.name}/${constants.emptyFolderPlaceholder}`;

  const { data: uploadData, error: uploadError } = await admin.storage
    .from(env.SUPABASE_BUCKET_ID)
    .upload(path, "");

  if (uploadError) {
    res.status(500).send({ message: uploadError.message });
    return;
  }

  const { error } = await storageAdmin
    .from("objects")
    .update({ owner: (res.locals.user as User).id })
    .eq("bucket_id", env.SUPABASE_BUCKET_ID)
    .eq("name", uploadData.path);

  if (error) {
    res.status(500).send({ message: error.message });
    return;
  }

  res.json({});
});

router.get("/suggestion", async (req: Request, res: Response) => {
  let count = 0;

  while (count < 5) {
    const suggestion = generateProjectName();
    const canCreate = await canCreateProject(suggestion);

    if (canCreate) {
      res.json({ suggestion });
      return;
    }

    count++;
  }

  res.sendStatus(500);
});

router.get("/availability", async (req: Request, res: Response) => {
  const isAvailable = await canCreateProject(req.query);

  res.json({ isAvailable });
});

export default router;
