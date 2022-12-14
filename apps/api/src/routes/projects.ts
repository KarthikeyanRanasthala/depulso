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

const projectNameRegexp = /^[a-z-]+$/;

const generateProjectName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: "-",
    length: 3,
  });

const canCreateProject = async (user: User, requestQuery: unknown) => {
  const { data: limitData, error: limitError } = await storageAdmin
    .from("objects")
    .select("*")
    .eq("owner", user.id)
    .contains("path_tokens[2]", [constants.emptyFolderPlaceholder]);

  if (limitError) {
    throw new Error(limitError.message);
  }

  if (limitData.length >= Number(env.MAX_PROJECTS_LIMIT)) {
    return { canCreate: false, message: "Reached maximum projects limit" };
  }

  const querySchema = z.object({
    name: z
      .string()
      .min(4)
      .regex(
        projectNameRegexp,
        "Project name can only contain lowecase alphabets and hyphens"
      )
      .max(30),
  });

  const parsedQuery = querySchema.safeParse(requestQuery);

  if (parsedQuery.success) {
    const isBlackListed = constants.blacklist.includes(parsedQuery.data.name);

    if (isBlackListed) {
      return { canCreate: false, message: "Not allowed" };
    }

    const { data, error } = await admin.storage
      .from(env.SUPABASE_BUCKET_ID)
      .list(parsedQuery.data.name, {
        search: constants.emptyFolderPlaceholder,
      });

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return { canCreate: true };
    }
  } else {
    return { canCreate: false, message: parsedQuery.error.message };
  }

  return { canCreate: false };
};

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const { canCreate, message = "" } = await canCreateProject(
      res.locals.user,
      req.body
    );

    if (!canCreate) {
      res.status(400).send({ message });
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
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req: Request, res: Response, next) => {
  const bodySchema = z.object({
    name: z.string().min(1),
  });

  const parsedBody = bodySchema.safeParse(req.query);

  if (parsedBody.success) {
    const { data, error } = await storageAdmin
      .from("objects")
      .select("*")
      .eq("owner", (res.locals.user as User).id)
      .contains("path_tokens[1]", [parsedBody.data.name]);

    if (error) {
      res.status(500).send({ message: error?.message });
      return;
    }

    const promises = data?.map((file) =>
      storageAdmin.from("objects").delete().eq("name", file.name)
    );

    const responses = await Promise.all(promises || []);

    const messages = responses.filter((response) => response?.error?.message);

    if (messages.length) {
      res.status(500).json({ messages });
      return;
    }

    res.json({});
  } else {
    res.status(400).send({ message: parsedBody.error.message });
  }
});

router.get("/suggestion", async (req: Request, res: Response, next) => {
  try {
    let count = 0;

    while (count < 5) {
      const suggestion = generateProjectName();
      const { canCreate, message } = await canCreateProject(res.locals.user, {
        name: suggestion,
      });

      if (canCreate) {
        res.json({ suggestion });
        return;
      }

      if (message) {
        res.status(400).send({ message });
        return;
      }

      count++;
    }

    res.sendStatus(500);
  } catch (error) {
    next(error);
  }
});

router.get("/availability", async (req: Request, res: Response, next) => {
  try {
    const { canCreate, message } = await canCreateProject(
      res.locals.user,
      req.query
    );

    res.json({ isAvailable: canCreate, message });
  } catch (error) {
    next(error);
  }
});

export default router;
