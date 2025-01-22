import express from "express";
import next from "next";

import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource, getModelByName } from "@adminjs/prisma";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** @typedef {{ port: number, isProduction: boolean }} AppOptions */

export class App {
  isProduction = false;
  port = 3000;

  #nextServer = next({
    dev: !this.isProduction,
    turbopack: true,
    port: this.port,
  });

  /** @type {AdminJS} */
  #adminApp;
  #adminRouter;

  models = [];

  /**
   *
   * @param {string[]} models
   * @param {AppOptions} options
   */
  constructor(models, options) {
    const { isProduction = false, port = 3000 } = options;

    this.models = models;

    this.isProduction = isProduction;
    this.port = port;
  }

  #initAdmin() {
    if (this.models.length === 0)
      return console.warn("Models is empty, admin dashboard can't initialize!");

    AdminJS.registerAdapter({ Database, Resource });

    this.#adminApp = new AdminJS({
      resources: this.models.map(modelName => {
        return {
          resource: {
            model: getModelByName(modelName),
            client: prisma,
          },
          options: {},
        };
      }),
      rootPath: "/admin",
    });

    this.#adminRouter = AdminJSExpress.buildRouter(this.#adminApp);

    return;
  }
  init() {
    this.#nextServer.prepare().then(() => {
      const nextHandle = this.#nextServer.getRequestHandler();

      const expressServer = express();

      // init admin app
      if (this.models.length > 0) {
        this.#initAdmin();

        expressServer.use(this.#adminApp.options.rootPath, this.#adminRouter);
      }

      // Proxing to next handle
      expressServer.all("*", (req, res) => nextHandle(req, res));

      expressServer.listen(this.port, err => {
        if (err) return this.#nextServer.logError(err);

        return;
      });
    });
  }
}
