import { resolve } from "path";

/**
 * @typedef {(...paths: string[]) => string} Resolve
 */

/** @type {Resolve} */
export const inLocales = (...paths) => resolve("./locales", ...paths);

/** @type {Resolve}  */
export const inApp = (...paths) => resolve("./src/app", ...paths);
