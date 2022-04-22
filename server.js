const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    // apply proxy in dev mode

    if (dev) {
      server.use(
        "/auth",
        createProxyMiddleware({
          target: "http://localhost:8000",
          changeOrigin: false,
        })
      );
    }

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log("Error", err);
  });