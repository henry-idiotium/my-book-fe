const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

const plugins = require('./src/app/utils/tailwind-plugins');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  plugins,
};
