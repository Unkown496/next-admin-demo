import "dotenv/config";

import { App } from "./utils/app.js";

const app = new App(["Post"], {
  isProduction: process.env.NODE_ENV === "production",
  port: process.env.PORT || 3000,
});

app.init();
