/// <reference types="vitest" />
import dns from 'dns';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

dns.setDefaultResultOrder('verbatim'); // show url as localhost:{port}

export default defineConfig(({ command }) => ({
  plugins: [react(), viteTsConfigPaths({ root: './' })],

  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName:
        command === 'serve' ? '[name]_[local]' : '[hash:base64:8]',
    },
  },

  cacheDir: './node_modules/.vite/my-book-fe',

  server: { port: Number(process.env.PORT) },
  define: {
    'process.env': process.env,
  },
  test: {
    globals: true,
    cache: { dir: './node_modules/.vitest' },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
}));
