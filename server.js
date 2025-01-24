import 'dotenv/config';

import { App } from './utils/app.js';

// express-helmet plugin
import helmet from 'helmet';

// models here
const modelsNames = ['Admin'];

const app = new App(modelsNames, {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,

  cookieSecret: process.env.COOKIE_SECRET || 'secret',

  onLoadPlugins(server) {
    server.use(helmet());

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
