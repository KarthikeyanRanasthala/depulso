const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const target = "https://tlwefoetxptbnjgmdwhb.supabase.co";

const hostname = ".karthikeyan.sh";

const app = express();

app.get("/", (_, res) => {
  res.json({ message: "Go Depulso!" });
});

app.get(
  "*",
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) =>
      `/storage/v1/object/public/deployments/${
        req.hostname.split(hostname)[0]
      }${path}`,
    onProxyReq: (_, r) => console.log(r.url),
  })
);

app.listen(process.env.PORT, () =>
  console.log(`Listening... ${process.env.PORT}`)
);
