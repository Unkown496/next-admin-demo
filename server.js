import 'dotenv/config';

import next from 'next';

import express from 'express';

import AdminJS from 'adminjs';
import { Database, Resource, getModelByName } from '@adminjs/prisma';

import { PrismaClient } from '@prisma/client';
import { buildRouter } from '@adminjs/express';

const isProduction = process.env.NODE_ENV === 'production';

const port = process.env.PORT || 3000;

class AppServer {
  // next env
  nextApp = next({
    dev: !isProduction,
    turbopack: true,
  });
  nextServerHandler = this.nextApp.getRequestHandler();

  // express env
  expressServer = express();

  prisma = new PrismaClient();

  models = ['Post'];

  /** @type {AdminJS} */
  adminApp;
  adminAppRouter;

  constructor() {}

  initAdmin() {
    AdminJS.registerAdapter({ Database, Resource });

    this.adminApp = new AdminJS({
      resources: this.models.map(modelName => {
        return {
          resource: { model: getModelByName(modelName), client: this.prisma },
        };
      }),
      rootPath: '/admin',
    });

    this.adminAppRouter = buildRouter(this.adminApp);
  }

  init() {
    this.initAdmin();

    // throw request/responce to next server
    this.expressServer.use((req, res) => this.nextServerHandler(req, res));

    // throw admin app in express
    this.expressServer.use(this.adminApp.options.rootPath, this.adminAppRouter);

    // start next and express server
    this.nextApp.prepare().then(() => {
      this.expressServer.listen(port + 1, () =>
        console.log('express server running!', port),
      );
    });

    return;
  }
}

const app = new AppServer();
app.init();
