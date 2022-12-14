const path = require("path");

const express = require("express");
const {
  createProxyMiddleware,
  responseInterceptor,
} = require("http-proxy-middleware");
const { createClient } = require("@supabase/supabase-js");

const target = "https://tlwefoetxptbnjgmdwhb.supabase.co";

const hostname = ".karthikeyan.sh";

const bucket = "deployments";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsd2Vmb2V0eHB0Ym5qZ21kd2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA5NDYzMDcsImV4cCI6MTk4NjUyMjMwN30.tOkLo2YYVxVNI4-kSajFaMzpQcqyNlzsmGSEuZLrzJg";

const SUPABASE_URL = "https://tlwefoetxptbnjgmdwhb.supabase.co";

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

const app = express();

app.get(
  "*",
  async (req, _, next) => {
    req.depulsoProject = req.hostname.split(hostname)[0];

    // For root
    if (req.path === "/") {
      const { data, error } = await client.storage
        .from(bucket)
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
      .from(bucket)
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
        .from(bucket)
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
    target,
    changeOrigin: true,
    pathRewrite: (_, req) =>
      `/storage/v1/object/public/${bucket}/${req.depulsoProject}${
        req.depulsoFilePath ? req.depulsoFilePath : ""
      }`,
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
