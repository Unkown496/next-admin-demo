import 'dotenv/config';

import { App } from './utils/app.js';

// models here
const modelsNames = ['Admin'];

const app = new App(modelsNames, {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,

  cookieSecret: process.env.COOKIE_SECRET || 'secret',

  adminJSOptions: {
    branding: {
      companyName: 'Admin',
      logo: false,
      withMadeWithLove: false,
    },
  },
});

app.init();
