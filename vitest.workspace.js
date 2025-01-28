import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vitest.config.js',
    test: {
      environment: 'jsdom',
      name: 'unit-browser',
      include: [
        './src/app/tests/browser/**/*.unit.test.js',
        './src/app/tests/browser/**/*.unit.test.jsx',
      ],
    },
  },
  {
    extends: './vitest.config.js',
    test: {
      environment: 'jsdom',
      name: 'integration-browser',
      include: [
        './src/app/tests/browser/**/*.integration.test.js',
        './src/app/tests/browser/**/*.integration.test.jsx',
      ],
    },
  },
  {
    extends: './vitest.config.js',
    test: {
      environment: 'node',
      name: 'unit-server',
      include: ['./src/app/tests/server/**/*.unit.test.js'],
    },
  },
  {
    extends: './vitest.config.js',
    test: {
      environment: 'node',
      name: 'integration-server',
      include: ['./src/app/tests/server/**/*.integration.test.js'],
    },
  },
]);
