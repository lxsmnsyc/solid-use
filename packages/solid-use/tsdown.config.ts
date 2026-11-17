import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    atom: 'src/atom.ts',
    'client-only': 'src/client-only.ts',
    fetch: 'src/fetch.ts',
    'media-query': 'src/media-query.ts',
    'online-status': 'src/online-status.ts',
    'page-visibility': 'src/page-visibility.ts',
    props: 'src/props.ts',
    provider: 'src/provider.ts',
    'server-value': 'src/server-value.ts',
    string: 'src/string.ts',
  },
  // Solid 2 is ESM-only, so this line ships no CJS build.
  format: ['esm'],
  platform: 'neutral',
  target: 'es2022',
  dts: true,
  sourcemap: true,
  clean: true,
  exports: true,
  publint: true,
});
