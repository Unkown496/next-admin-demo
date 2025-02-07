import { faker } from "@faker-js/faker";

/**
 * @exports
 * @template T
 * @typedef {(count?: number | { min: number, max: number } ) => Array<T>} Multiple
 */

/** @type {() => { id: number, email: string, password: string }} */
export function adminSeed() {
  return {
    id: faker.number.int({ max: 1000 }),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

/** @type {Multiple<ReturnType<adminSeed>>} */
export const createAdmins = (count = 3) =>
  faker.helpers.multiple(adminSeed, {
    count,
  });
