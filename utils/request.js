/** @type {(headers: Headers) => Record<string, string>}  */
export const headersToObject = headers =>
  Object.fromEntries(Array.from(headers.entries()));
