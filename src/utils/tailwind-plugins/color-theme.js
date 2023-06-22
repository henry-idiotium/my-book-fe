/* eslint-disable @typescript-eslint/no-empty-function */
const plugin = require('tailwindcss/plugin');

const CSS_PREFIX = '--c';

const { common, bg, border, shadow, text } = InitTailwindColorSchema();

module.exports = plugin(() => {}, {
  theme: {
    extend: {
      backgroundColor: { ...common, ...bg },
      textColor: { ...common, ...text },
      borderColor: { ...common, ...border },
      boxShadowColor: shadow,
    },
  },
});

// init color function
function InitTailwindColorSchema() {
  return {
    common: getTailwindSchema({
      accent: 'accent',
      neutral: 'neutral',
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'error',
      'accent-hover': 'accent-hover',
      'neutral-hover': 'neutral-hover',
      'info-hover': 'info-hover',
      'success-hover': 'success-hover',
      'warning-hover': 'warning-hover',
      'error-hover': 'error-hover',
      'accent-focus': 'accent-focus',
      'neutral-focus': 'neutral-focus',
      'info-focus': 'info-focus',
      'success-focus': 'success-focus',
      'warning-focus': 'warning-focus',
      'error-focus': 'error-focus',
    }),
    bg: getTailwindSchema({
      base: 'base',
      'base-focus': 'base-focus',
      'base-hover': 'base-hover',
      'base-invert': 'base-invert',

      // overlay
      overlay: 'overlay',
    }),
    text: getTailwindSchema({
      color: 'text',
      'color-accent': 'text-accent',
      'color-invert': 'text-invert',
    }),
    border: getTailwindSchema({
      color: 'border',
      'color-accent': 'border-accent',
      'color-emphasis': 'border-emphasis',
    }),
    shadow: getTailwindSchema({
      'color-base': 'base-focus',
      'color-base-focus': 'base-focus',
      'color-base-hover': 'base-hover',
    }),
  };
}

// helpers
/**
 * @param {object} schema
 * @returns {object}
 */
function getTailwindSchema(schema) {
  const tailwindSchema = {};

  const getValue = (name) => wrapVar(name);

  for (const [key, value] of Object.entries(schema)) {
    tailwindSchema[key] = getValue(value);
  }

  return tailwindSchema;
}
function wrapVar(name) {
  const cssVar = join(CSS_PREFIX, name);
  return `rgb(var(${cssVar}) / <alpha-value>)`;
}
function join(...arr) {
  return arr.filter(Boolean).join('-');
}
