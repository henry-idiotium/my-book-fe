/// <reference types="vitest" />
import dns from 'dns';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

dns.setDefaultResultOrder('verbatim'); // show url as localhost:{port}

export default defineConfig(({ mode, command }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const PORT = Number(process.env.VITE_PORT);

  return {
    plugins: [react(), viteTsConfigPaths({ root: './' })],

    server: { port: PORT },
    preview: { port: PORT + 1000 },

    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName:
          command === 'serve' ? '[name]_[local]' : '[hash:base64:8]',
      },
    },

    cacheDir: './node_modules/.vite/my-book-fe',

    test: {
      globals: true,
      cache: { dir: './node_modules/.vitest' },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  };
});
