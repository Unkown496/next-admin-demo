/** @type {(url: string, init: RequestInit) => Request} */
export const testRequest = (url, init = { method: 'GET' }) =>
  new Request(new URL(url, import.meta.env.SITE_URL), init);
