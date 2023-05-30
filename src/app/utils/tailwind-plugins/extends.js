/* eslint-disable
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-var-requires
*/
/**
 * @typedef { import('tailwindcss/defaultTheme') } defaultTheme
 * @typedef { import('tailwindcss/plugin') } plugin
 */

const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

const spacingTheme = getTheme('spacing');

function getTheme(type) {
  return ({ theme }) => ({ ...theme(type) });
}

module.exports = plugin(
  ({ addUtilities, matchUtilities, theme, e }) => {
    // square
    addUtilities(
      Object.entries(theme('width')).map(([key, value]) => {
        return {
          [`.${e(`wh-${key}`)}`]:
            key === 'screen'
              ? { width: '100vw', height: '100vh' }
              : { width: value, height: value },
        };
      })
    );
    matchUtilities(
      { wh: (value) => ({ width: value, height: value }) },
      { values: theme('wh') }
    );

    // overflow
    addUtilities({
      '.overflow-x-overlay': { 'overflow-x': 'overlay' },
      '.overflow-y-overlay': { 'overflow-y': 'overlay' },
      '.overflow-overlay': {
        'overflow-x': 'overlay',
        'overflow-y': 'overlay',
      },
    });
  },
  {
    variants: { wh: ['responsive', 'hover'] },
    theme: {
      extend: {
        maxHeight: spacingTheme,
        maxWidth: spacingTheme,
        minHeight: spacingTheme,
        minWidth: spacingTheme,
        borderWidth: { 3: '3px', 5: '5px', 6: '6px', 7: '7px' },
        borderRadius: {
          primary: '16px',
          secondary: '8px',
          tertiary: '12px',
        },
        fontFamily: {
          sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
          reading: 'Quicksand, sans-serif',
        },
        screens: {
          '<2xl': { max: '1535px' },
          '<xl': { max: '1279px' },
          '<lg': { max: '1023px' },
          '<md': { max: '767px' },
          '<sm': { max: '639px' },
          '<xs': { max: '319px' },
          '@2xl': { min: '1536px' },
          '@xl': { min: '1280px', max: '1535px' },
          '@lg': { min: '1024px', max: '1279px' },
          '@md': { min: '768px', max: '1023px' },
          '@sm': { min: '640px', max: '767px' },
          '@xs': { min: '320px', max: '639px' },
        },
      },
    },
  }
);
