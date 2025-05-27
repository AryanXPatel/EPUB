const express = require("express");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const serverless = require("serverless-http");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "blob:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "blob:"],
        imgSrc: ["'self'", "blob:", "data:"],
        connectSrc: ["'self'", "blob:", "data:"],
        frameSrc: ["blob:", "data:"],
        objectSrc: ["blob:", "data:"],
        formAction: ["'none'"],
      },
    },
  })
);
app.use(cors());
app.use(compression());

app.use(
  "/public",
  express.static(path.join(__dirname, "..", "public"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

app.use(
  "/js",
  express.static(path.join(__dirname, "..", "src"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Export handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);
