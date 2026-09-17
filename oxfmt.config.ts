import { defineConfig } from 'oxfmt';

export default defineConfig({
  singleQuote: true,
  // Docs are prose. oxfmt rewrites the snippets inside them in ways that make the examples worse.
  // Changesets end up in the changelog as written.
  ignorePatterns: ['**/dist/**', '**/.output/**', 'docs/**', '.changeset/*.md'],
});
