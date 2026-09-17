import { solidStart } from '@solidjs/start/config';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // Nitro turns the SolidStart server into a runnable server in `.output`.
  plugins: [solidStart(), nitro()],
});
