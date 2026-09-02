import config from '@lxsmnsyc/oxlint-config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [config],
  ignorePatterns: ['**/dist/**', '**/node_modules/**', '**/.nx/**'],
  rules: {
    // Solid components are plain functions with capitalised names, and calling
    // one directly (`Show({ ... })`, `Comp(props)`) is how a library composes
    // them without going through JSX.
    'new-cap': 'off',
  },
  overrides: [
    {
      // These primitives exist to erase and re-apply types across boundaries
      // the compiler cannot follow: `props.ts` builds accessor proxies over an
      // arbitrary reactive object, `client-only.ts` and `provider.ts` bridge
      // `Component<any>`, `fetch.ts` surfaces `Response#json`, which the DOM
      // lib types as `any`, and `server-value.ts` casts the value it read back
      // out of Solid's hydration payload. Satisfying the rules here means
      // weakening the public generics, so the reports are silenced rather than
      // worked around. Tests and examples stay on the full rule set.
      files: ['packages/*/src/**'],
      rules: {
        'typescript/no-explicit-any': 'off',
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-return': 'off',
        'typescript/no-unsafe-type-assertion': 'off',
      },
    },
    {
      // Test scaffolding fakes browser globals and Solid internals - a
      // `MediaQueryList`, the `_$HY` hydration payload, components typed as
      // `never` so they can be rendered without JSX - none of which survive
      // the type-aware rules intact.
      files: ['packages/*/test/**'],
      rules: {
        'import/prefer-default-export': 'off',
        'no-console': 'off',
        'no-underscore-dangle': 'off',
        'typescript/explicit-function-return-type': 'off',
        'typescript/explicit-module-boundary-types': 'off',
        'typescript/no-unsafe-member-access': 'off',
        'typescript/no-unsafe-type-assertion': 'off',
      },
    },
    {
      // The SSR host loads its render entry through a dynamic `import()`, and
      // Vite types `ssrLoadModule` as `Record<string, any>`, so narrowing the
      // module to its render function is an assertion by construction.
      files: ['examples/**'],
      rules: {
        'import/prefer-default-export': 'off',
        'no-console': 'off',
        'typescript/explicit-function-return-type': 'off',
        'typescript/explicit-module-boundary-types': 'off',
        'typescript/no-unsafe-type-assertion': 'off',
      },
    },
  ],
});
