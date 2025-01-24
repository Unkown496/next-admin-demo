import { resolve } from 'path';
import { readFileSync, readdirSync } from 'fs';

// admin deps
import AdminJS from 'adminjs';
import { buildAuthenticatedRouter } from '@adminjs/express';
import { Database, Resource, getModelByName } from '@adminjs/prisma';

// prisma deps
import orm from '../prisma/orm.js';

// utils
import { inLocales } from './path.js';

/**
 * @typedef {{admin: Omit<import('adminjs').AdminJSOptions, "resources" | 'rootPath'>, auth: import('@adminjs/express').AuthenticationOptions['authenticate'], buildRouter: typeof buildAuthenticatedRouter, cookieSecret: string }} AdminOptions
 */

export class Admin {
  models;
  options;
  /** @type {AdminOptions['auth']} */
  auth;

  cookieSecret;

  buildRouter;

  /** @type {import("adminjs").AdminJS} */
  app;
  /** @type {import("express").Router} */
  router;

  /** @type {Record<string, import('adminjs').LocaleTranslations>} */
  #adminLocales = {};

  /**
   * @param {AdminOptions} options
   * @param {string[]} models
   */
  constructor(models, options) {
    const {
      admin,
      cookieSecret = 'secret',
      auth,
      buildRouter = buildAuthenticatedRouter,
    } = options;

    this.models = models;
    this.options = admin;
    this.cookieSecret = cookieSecret;
    this.auth = auth;
    this.buildRouter = buildAuthenticatedRouter;
  }

  #loadLocales() {
    let localesInDir = readdirSync(resolve('./locales'));
    if (localesInDir.length === 0) return;

    localesInDir = localesInDir.filter(
      localeFile => localeFile.split('.')[1] === 'json',
    );

    localesInDir.forEach(localFileName => {
      const localeData = JSON.parse(
        readFileSync(inLocales(localFileName), 'utf-8'),
      );
      const localeName = localFileName.split('.')[0];

      this.#adminLocales[localeName] = localeData;
    });

    return;
  }

  init() {
    if (this.models.length === 0)
      return console.warn("Models is empty, admin dashboard can't initialize!");
    if (!this.auth)
      return console.warn(
        "Auth callback is not defined, can't initialize admin!",
      );

    // auto load locales of locales dir
    this.#loadLocales();

    AdminJS.registerAdapter({ Database, Resource });

    this.app = new AdminJS({
      ...this.options,

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

      locale: {
        language: 'en',
        availableLanguages: ['en', ...Object.keys(this.#adminLocales)],
        localeDetection: true,
        translations: {
          ...this.#adminLocales,
        },
      },

      rootPath: '/admin',
    });

    this.router = this.buildRouter(this.app, {
      cookieName: 'adminAuth',
      authenticate: this.auth,
      cookiePassword: this.cookieSecret,
    });

    return {
      adminApp: this.app,
      adminRouter: this.router,
    };
  }
}
