import { defineConfig } from 'vitest/config';

// `solid-js` and `@solidjs/web` ship a browser build and a server build behind
// export conditions. The suite runs twice - once resolved to each build - so
// that every isomorphic primitive is exercised in both environments.
const CLIENT_CONDITIONS = ['browser', 'import', 'module', 'default'];
const SERVER_CONDITIONS = ['node', 'import', 'module', 'default'];

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { conditions: CLIENT_CONDITIONS },
        ssr: { resolve: { conditions: CLIENT_CONDITIONS } },
        test: {
          name: 'client',
          environment: 'jsdom',
          include: ['test/client/**/*.test.ts', 'test/shared/**/*.test.ts'],
        },
      },
      {
        resolve: { conditions: SERVER_CONDITIONS },
        ssr: { resolve: { conditions: SERVER_CONDITIONS } },
        test: {
          name: 'server',
          environment: 'node',
          include: ['test/server/**/*.test.ts', 'test/shared/**/*.test.ts'],
        },
      },
    ],
  },
});
