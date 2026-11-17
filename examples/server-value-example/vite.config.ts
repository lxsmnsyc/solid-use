import solid from '@solidjs/vite-plugin';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    // `start: true` hands the plugin the entries, the dev middleware and the
    // build, and `ssr: true` selects server rendering. `src/App.tsx` is the
    // root component by convention, so there is no index.html, no mount file
    // and no server wiring of our own.
    solid({ start: true, ssr: true }),
    // Nitro picks up the SSR handler the plugin exposes and turns it into a
    // runnable server under `.output`, so `pnpm build` produces something
    // deployable rather than a bare handler module.
    nitro(),
  ],
});
