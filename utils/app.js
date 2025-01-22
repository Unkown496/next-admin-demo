// env setup
import 'dotenv/config';

// other deps
import ora from 'ora';
import { styleText } from 'node:util';

// server desp
import express from 'express';
import next from 'next';

// admin js deps
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource, getModelByName } from '@adminjs/prisma';

// prisma deps
import orm from '../prisma/orm.js';

/** @typedef {{ port: number, isProduction: boolean, cookieSecret: string, adminJSOptions: Omit<import('adminjs').AdminJSOptions, "resources" | 'rootPath'> }} AppOptions */

/** @type {(email: string, password: string) => Promise<string | null>} */
const appAuth = async (email, password) => {
  const token = await orm.admin.singIn({ email, password });

  return token;
};

export class App {
  isProduction = false;
  port = 3000;
  adminJSOptions = {};
  cookieSecret = 'secret';

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
    const {
      isProduction = false,
      cookieSecret = 'secret',
      port = 3000,
      adminJSOptions = {},
    } = options;

    this.models = models;

    this.isProduction = isProduction;
    this.port = port;
    this.adminJSOptions = adminJSOptions;
    this.cookieSecret = cookieSecret;
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
            client: orm,
          },
          options: {
            parent: {
              name: '',
            },
          },
        };
      }),
      rootPath: '/admin',

      ...this.adminJSOptions,
    });

    this.#adminRouter = AdminJSExpress.buildAuthenticatedRouter(
      this.#adminApp,
      {
        cookieName: 'adminAuth',
        authenticate: appAuth,
        cookiePassword: this.cookieSecret,
      },
    );

    return;
  }
  init() {
    const load = ora({
        text: 'Initialization server...',
        hideCursor: true,
        prefixText: styleText('blue', 'server:'),
      }),
      loadAdmin = ora({
        text: 'Initilazation admin app...',
        hideCursor: true,
        prefixText: styleText('magenta', 'admin:'),
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
      expressServer.all('*', (req, res) => nextHandle(req, res));

      expressServer.listen(this.port, err => {
        if (err) return this.#nextServer.logError(err);

        load.stopAndPersist({
          text: `Server successfylly running at ${styleText(
            'green',
            this.isProduction
              ? `port:${this.port}`
              : `http://localhost:${this.port}`,
          )}`,
        });

        return;
      });
    });
  }
}
