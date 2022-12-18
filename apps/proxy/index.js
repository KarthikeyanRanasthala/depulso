const path = require("path");

const express = require("express");
const {
  createProxyMiddleware,
  responseInterceptor,
} = require("http-proxy-middleware");
const { createClient } = require("@supabase/supabase-js");
const { z } = require("zod");
const dotenv = require("dotenv");

dotenv.config();

const envSchema = z.object({
  SUPABASE_SERVICE_ROLE: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_BUCKET_ID: z.string().min(1),
  PORT: z.string(),
  DEPULSO_URL_SUFFIX: z.string().min(1),
});

const env = envSchema.parse(process.env);

const client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: "storage",
  },
});

const app = express();

app.get(
  "*",
  async (req, _, next) => {
    req.depulsoProject = req.hostname.split(env.DEPULSO_URL_SUFFIX)[0];

    // For root
    if (req.path === "/") {
      const { data, error } = await client.storage
        .from(env.SUPABASE_BUCKET_ID)
        .list(req.depulsoProject, {
          // search is not exact, need to filter again to find exact match
          search: "index.html",
        });

      if (error) {
        return next({ status: 500, ...error });
      }

      const file = data.find((el) => el.id && el.name === "index.html");

      if (file) {
        req.depulsoFilePath = "/index.html";
        req.depulsoMimeType = file.metadata.mimetype;
        return next();
      } else {
        return next({ status: 404 });
      }
    }

    let dirname = path.dirname(req.path);

    dirname = dirname === "/" ? "" : dirname;

    const basename = path.basename(req.path);

    const { data: dirData, error: dirError } = await client.storage
      .from(env.SUPABASE_BUCKET_ID)
      .list(`${req.depulsoProject}${dirname}`, {
        search: basename,
      });

    if (dirError) {
      return next({ status: 500, ...dirError });
    }

    // Could be a file or a folder
    const content =
      dirData.find((file) => file.name === `${basename}.html`) ||
      dirData.find((file) => file.name === basename);

    if (content) {
      // A file will have an id, a folder won't have an id
      if (content.id) {
        req.depulsoMimeType = content.metadata.mimetype;
        req.depulsoFilePath = `${dirname}/${content.name}`;
        return next();
      }

      const { data, error } = await client.storage
        .from(env.SUPABASE_BUCKET_ID)
        .list(`${req.depulsoProject}${req.path}`, {
          search: "index.html",
        });

      if (error) {
        return next({ status: 500, ...error });
      }

      const file = data.find((el) => el.id && el.name === "index.html");

      if (file) {
        req.depulsoMimeType = file.metadata.mimetype;
        req.depulsoFilePath = `${dirname}/${basename}/index.html`;
        return next();
      } else {
        return next({ status: 404 });
      }
    }

    next({ status: 404 });
  },
  (err, _, res, next) => {
    if (err) {
      res.sendStatus(err.status);
      return;
    }

    next();
  },
  createProxyMiddleware({
    target: env.SUPABASE_URL,
    changeOrigin: true,
    pathRewrite: (_, req) =>
      `/storage/v1/object/public/${env.SUPABASE_BUCKET_ID}/${
        req.depulsoProject
      }${req.depulsoFilePath ? req.depulsoFilePath : ""}`,
    onProxyReq: (_, r) => console.log(r.url),
    selfHandleResponse: true,
    onProxyRes: responseInterceptor((responseBuffer, _, req, res) => {
      if (req.depulsoMimeType) {
        res.setHeader("Content-Type", req.depulsoMimeType);
      }

      return responseBuffer;
    }),
  })
);

app.listen(process.env.PORT, () =>
  console.log(`Listening... ${process.env.PORT}`)
);
