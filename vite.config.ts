/// <reference types="vitest" />
import dns from 'dns';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

dns.setDefaultResultOrder('verbatim'); // show url as localhost:{port}

export default defineConfig({
  plugins: [react(), viteTsConfigPaths({ root: './' })],

  cacheDir: './node_modules/.vite/my-book-fe',

  server: { port: 3200 },
  preview: { port: 3300 },
  test: {
    globals: true,
    cache: { dir: './node_modules/.vitest' },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});

