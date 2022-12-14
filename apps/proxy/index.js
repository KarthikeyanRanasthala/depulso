const express = require("express");
const {
  createProxyMiddleware,
  responseInterceptor,
} = require("http-proxy-middleware");
const mime = require("mime");

const target = "https://tlwefoetxptbnjgmdwhb.supabase.co";

const hostname = ".karthikeyan.sh";

const app = express();

// app.get("/", (_, res) => {
//   res.json({ message: "Go Depulso!" });
// });

app.get(
  "*",
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) =>
      `/storage/v1/object/public/deployments/${
        req.hostname.split(hostname)[0]
      }${path}${path.endsWith("/") ? "/index.html" : ""}`,
    onProxyReq: (_, r) => console.log(r.url),
    selfHandleResponse: true,
    onProxyRes: responseInterceptor((responseBuffer, _, req, res) => {
      const contentType = mime.getType(req.url);

      if (contentType) {
        res.setHeader("Content-Type", contentType);
      }

      return responseBuffer;
    }),
  })
);

app.listen(process.env.PORT, () =>
  console.log(`Listening... ${process.env.PORT}`)
);
