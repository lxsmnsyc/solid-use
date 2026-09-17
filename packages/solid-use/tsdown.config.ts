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
  // CJS is kept so `require()` users on the 0.x line keep working.
  format: ['esm', 'cjs'],
  outputOptions: {
    // Keeps `require('solid-use/atom').default`, the shape earlier CJS builds had.
    exports: 'named',
  },
  platform: 'neutral',
  target: 'es2018',
  dts: true,
  sourcemap: true,
  clean: true,
  exports: true,
  publint: true,
});
