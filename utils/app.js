// env setup
import 'dotenv/config';

// other deps
import ora from 'ora';
import { styleText } from 'node:util';

// server desp
import express from 'express';
import next from 'next';

// admin deps
import { Admin } from './admin.js';

// prisma deps
import orm from '../prisma/orm.js';

/** @typedef {(server: import("express").Express, options: { isProduction: boolean, port: number }) => void} LoadPluginsFunction */
/** @typedef {{ port: number, isProduction: boolean, cookieSecret: string, adminJSOptions: Omit<import('adminjs').AdminJSOptions, "resources" | 'rootPath'>, onLoadPlugins: LoadPluginsFunction }} AppOptions */

/** @type {(email: string, password: string) => Promise<string | null>} */
const appAuth = async (email, password) => {
  const token = await orm.admin.singIn({ email, password });

  return token;
};

export class App {
  /** @type {ReturnType<next>} */
  #nextServer;
  /** @type {import("express").Express} */
  #expressServer;

  #adminApp;

  /** @type {LoadPluginsFunction} */
  loadPlugins;
  isProduction;
  port;

  /**
   * @param {string[]} models
   * @param {AppOptions} options
   */
  constructor(models, options) {
    const {
      cookieSecret,
      port = 3000,
      isProduction = false,
      adminJSOptions = {},
      onLoadPlugins,
    } = options;

    this.#adminApp = new Admin(models, {
      auth: appAuth,
      admin: adminJSOptions,
      cookieSecret,
    });

    this.loadPlugins = onLoadPlugins;

    this.port = port;
    this.isProduction = isProduction;
  }

  #initRequiredPlugins() {
    // load user plugins
    if (!!this.loadPlugins)
      this.loadPlugins(this.#expressServer, {
        isProduction: this.isProduction,
        port: this.port,
      });

    return;
  }
  #initAdmin() {
    return this.#adminApp.init();
  }
  #initNext() {
    this.#nextServer = next({
      port: this.port,
      dev: !this.isProduction,
      turbopack: true,
    });

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

    this.#initNext();

    this.#nextServer.prepare().then(() => {
      this.#expressServer = express();
      const nextHandle = this.#nextServer.getRequestHandler();

      this.#initRequiredPlugins();
      const admin = this.#initAdmin();

      if (!!admin) {
        this.#expressServer.use(
          admin.adminApp.options.rootPath,
          admin.adminRouter,
        );

        loadAdmin.stopAndPersist({
          text: `Admin app successfylly start on path ${styleText(
            'cyan',
            admin.adminApp.options.rootPath,
          )}`,
        });
      }

      // finally include next
      this.#expressServer.all('*', (req, res) => nextHandle(req, res));

      // server listen on port
      this.#expressServer.listen(this.port, err => {
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

    return;
  }
}
