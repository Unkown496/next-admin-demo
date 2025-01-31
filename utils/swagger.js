import { styleText } from 'node:util';

import ora from 'ora';

import swaggerExpress from 'express-jsdoc-swagger';
import { inApp } from './path.js';

/** @typedef {Omit<import('express-jsdoc-swagger').Options, "baseDir" | "filesPattern" | "exposeApiDocs" | "multiple">} SwaggerExpressOptions */

export class Swagger {
  /**
   * @param {SwaggerExpressOptions} options
   * @param {import('express').Express} app
   */
  constructor(options, app) {
    const loadSwagger = ora({
      text: 'Initialization swagger...',
      hideCursor: true,
      prefixText: styleText('magenta', 'swagger:'),
    });

    loadSwagger.start();

    const { swaggerUIPath = '/api/docs' } = options;

    if (app.get('isDev'))
      swaggerExpress(app)({
        ...options,

        swaggerUIPath,

        baseDir: inApp('api'),
        filesPattern: './**/*.js',
        exposeApiDocs: false,
        multiple: true,
      });
    else
      loadSwagger.stopAndPersist({
        text: 'In production mode swagger not initilazation!',
      });

    loadSwagger.stopAndPersist({
      text: `Swagger successfylly running at ${styleText(
        'green',
        swaggerUIPath,
      )}`,
    });
  }
}
