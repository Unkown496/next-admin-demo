import swaggerExpress from "express-jsdoc-swagger";
import { inApp } from "./path.js";

/** @typedef {Omit<import('express-jsdoc-swagger').Options, "baseDir" | "filesPattern" | "swaggerUIPath">} SwaggerExpressOptions */

export class Swagger {
  /**
   * @param {SwaggerExpressOptions} options
   * @param {import('express').Express} app
   */
  constructor(options, app) {
    swaggerExpress(app)({
      ...options,

      baseDir: inApp("api"),
      filesPattern: "./**/*.js",
      swaggerUIPath: "/api-docs",
      exposeApiDocs: false,
      multiple: true,
    });
  }
}
