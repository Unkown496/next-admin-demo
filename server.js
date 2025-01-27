import 'dotenv/config';

import { App } from './utils/app.js';
import { Swagger } from './utils/swagger.js';

// express-helmet plugin
import helmet from 'helmet';

// models here
const modelsNames = [''];

const app = new App(modelsNames, {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,

  cookieSecret: process.env.COOKIE_SECRET || 'secret',

  onLoadPlugins(server, { isProduction, port }) {
    if (!isProduction)
      new Swagger(
        {
          info: {
            version: '1.0.0',
            description: 'test-desc',
            title: 'test api',
          },
        },
        server,
      );

    server.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
          },
        },
      }),
    );

    return server;
  },

  adminJSOptions: {
    branding: {
      companyName: 'Admin',
      logo: false,
      withMadeWithLove: false,
    },
  },
});

app.init();
