import { resolve } from 'path';

/** @type {(...paths: string[]) => string} */
export const inLocales = (...paths) => resolve('./locales', ...paths);
