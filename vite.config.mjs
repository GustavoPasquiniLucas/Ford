import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        overview: resolve(import.meta.dirname, 'index.html'),
        simulation: resolve(import.meta.dirname, 'simulation.html'),
      },
    },
  },
});
