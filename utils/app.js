// other deps
import ora from "ora";
import { styleText } from "node:util";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// server desp
import express from "express";
import next from "next";

// admin js deps
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource, getModelByName } from "@adminjs/prisma";

// prisma deps
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** @typedef {{ port: number, isProduction: boolean }} AppOptions */

/** @type {(email: string, password: string) => Promise<string | null>} */
const appAuth = async (email, password) => {
  const admin = await prisma.user.findUnique({
    where: { email },
  });

  // admin not found
  if (!admin) return null;

  const passwordMatch = await argon2.verify(admin.password, password);

  // password dont match
  if (!passwordMatch) return null;

  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "1h" }
  );

  return token;
};

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
    const load = ora({
        text: "Initialization server...",
        hideCursor: true,
        prefixText: styleText("blue", "server:"),
      }),
      loadAdmin = ora({
        text: "Initilazation admin app...",
        hideCursor: true,
        prefixText: styleText("magenta", "admin:"),
      });

    load.start();

    this.#nextServer.prepare().then(() => {
      const nextHandle = this.#nextServer.getRequestHandler();

      const expressServer = express();

      // init admin app
      if (this.models.length > 0) {
        loadAdmin.start();

        this.#initAdmin();

        expressServer.use(this.#adminApp.options.rootPath, this.#adminRouter);

        loadAdmin.stopAndPersist({
          text: `Admin app successfylly start on path ${
            this.#adminApp.options.rootPath
          }`,
        });
      }

      // Proxing to next handle
      expressServer.all("*", (req, res) => nextHandle(req, res));

      expressServer.listen(this.port, err => {
        if (err) return this.#nextServer.logError(err);

        load.stopAndPersist({
          text: `Server successfylly running at ${styleText(
            "green",
            this.isProduction
              ? `port:${this.port}`
              : `http://localhost:${this.port}`
          )}`,
        });

        return;
      });
    });
  }
}
