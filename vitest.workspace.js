import { defineWorkspace } from "vitest/config";

const asyncPaths = [
  "./src/app/tests/browser/async/**/*.unit.test.js",
  "./src/app/tests/browser/async/**/*.unit.test.jsx",
  "./src/app/tests/browser/async/**/*.integration.test.js",
  "./src/app/tests/browser/async/**/*.integration.test.jsx",
];

export default defineWorkspace([
  {
    extends: "./vitest.config.js",
    test: {
      environment: "jsdom",
      name: "unit-browser",
      mockReset: true,
      setupFiles: ["./src/app/tests/vitest.setup.jsx"],
      include: [
        "./src/app/tests/browser/**/*.unit.test.js",
        "./src/app/tests/browser/**/*.unit.test.jsx",
      ],
      exclude: asyncPaths,
    },
  },
  {
    extends: "./vitest.config.js",
    test: {
      environment: "jsdom",
      mockReset: true,
      name: "integration-browser",
      setupFiles: ["./src/app/tests/vitest.setup.jsx"],
      include: [
        "./src/app/tests/browser/**/*.integration.test.js",
        "./src/app/tests/browser/**/*.integration.test.jsx",
      ],
      exclude: asyncPaths,
    },
  },

  {
    extends: "./vitest.config.js",
    test: {
      environment: "jsdom",
      mockReset: true,
      name: "async-browser",
      include: asyncPaths,
    },
  },

  {
    extends: "./vitest.config.js",
    test: {
      environment: "node",
      name: "unit-server",
      include: ["./src/app/tests/server/**/*.unit.test.js"],
    },
  },
  {
    extends: "./vitest.config.js",
    test: {
      environment: "node",
      name: "integration-server",
      include: ["./src/app/tests/server/**/*.integration.test.js"],
    },
  },
]);
