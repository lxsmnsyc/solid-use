import config from '@lxsmnsyc/oxlint-config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [config],
  ignorePatterns: ['**/dist/**', '**/node_modules/**', '**/.output/**', '**/.nx/**'],
  rules: {
    // Solid components are plain functions with capitalized names.
    // The library calls some of them directly, such as `Show({ ... })`.
    'new-cap': 'off',
  },
  overrides: [
    {
      // These helpers pass values through types the compiler cannot follow.
      // `props.ts` builds accessor proxies over any reactive object.
      // `client-only.ts` and `provider.ts` wrap `Component<any>`.
      // `fetch.ts` returns `Response#json`, which the DOM types as `any`.
      // `server-value.ts` reads back a value from the hydration payload.
      // Satisfying these rules would mean weakening the public types.
      files: ['packages/*/src/**'],
      rules: {
        'typescript/no-explicit-any': 'off',
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-return': 'off',
        'typescript/no-unsafe-type-assertion': 'off',
      },
    },
    {
      // Example components return JSX, and spelling out the return type adds noise to the demos.
      files: ['examples/**'],
      rules: {
        'typescript/explicit-function-return-type': 'off',
        'typescript/explicit-module-boundary-types': 'off',
      },
    },
  ],
});
