const plugin = require('tailwindcss/plugin');

const commonColors = getColor([
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
]);

module.exports = plugin(() => {}, {
  theme: {
    extend: {
      backgroundColor: {
        ...commonColors,
        base: 'var(--c-base)',
        'base-focus': 'var(--c-base-focus)',
        'base-hover': 'var(--c-base-hover)',
      },
      textColor: {
        ...commonColors,
        color: 'var(--c-text)',
        'color-accent': 'var(--c-text-accent)',
      },
      borderColor: {
        ...commonColors,
        color: 'var(--c-border)',
        'color-accent': 'var(--c-border-accent)',
      },
      boxShadowColor: { 'color-base': 'var(--c-base-focus)' },
    },
  },
});

function getColor(names = [''], prefix = '--c-', suffix = '-focus') {
  const scheme = {};
  const getValue = (name, suffix) => wrapVar(name, prefix, suffix);

  names.forEach((name) => {
    scheme[name] = getValue(name);

    if (suffix) scheme[name + suffix] = getValue(name + suffix);
  });

  return scheme;
}

function wrapVar(name, prefix = '', suffix = '') {
  const cssVar = prefix + name + suffix;
  return `var(${cssVar})`;
}
