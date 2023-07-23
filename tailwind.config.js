/** @typedef {import('tailwindcss').Config} config */

const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const plugins = require('./src/utils/tailwind-plugins');
const defaultTheme = require('tailwindcss/defaultTheme');

const spacingTheme = getTheme('spacing');

const config = {
  plugins,
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      maxHeight: spacingTheme,
      maxWidth: spacingTheme,
      minHeight: spacingTheme,
      minWidth: spacingTheme,
      borderWidth: { 3: '3px', 5: '5px', 6: '6px', 7: '7px' },
      borderRadius: {
        base: '16px',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        '2xl': '1536px',
        xl: '1280px',
        lg: '1024px',
        md: '768px',
        sm: '640px',
        xs: '320px',
        '2xl-max': { max: '1535px' },
        'xl-max': { max: '1279px' },
        'lg-max': { max: '1023px' },
        'md-max': { max: '767px' },
        'sm-max': { max: '639px' },
        'xs-max': { max: '319px' },

        // --------------------
        // custom
        // --------------------
        // Right Section Hidden
        rsh: '1000px',
        'rsh-max': { max: '999px' },
        // Phone Media Transformation
        pmt: '500px',
        'pmt-max': { max: '499px' },
      },
      lineHeight: {
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
      },
    },
    screens: {
      '2xl': '1536px',
      xl: '1280px',
      lg: '1024px',
      md: '768px',
      sm: '640px',
      xs: '320px',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '15px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '60px',
      '7xl': '72px',
    },
    spacing: {
      px: '1px',
      0: '0',
      0.5: '2px',
      1: '4px',
      1.5: '6px',
      2: '8px',
      2.5: '10px',
      3: '12px',
      3.5: '14px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '48px',
      14: '56px',
      16: '64px',
      20: '80px',
      24: '96px',
      28: '112px',
      32: '128px',
      36: '144px',
      40: '160px',
      44: '176px',
      48: '192px',
      52: '208px',
      56: '224px',
      60: '240px',
      64: '256px',
      72: '288px',
      80: '320px',
      96: '384px',
    },
  },
};

function getTheme(type) {
  return ({ theme }) => ({ ...theme(type) });
}

module.exports = config;
