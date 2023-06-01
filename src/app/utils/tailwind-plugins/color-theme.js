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
      backgroundColor: { ...getColor(['base']), ...commonColors },
      colors: { ...getColor(['color'], undefined, '-accent'), ...commonColors },
    },
  },
});

function getColor(names = [''], prefix = '--c-', suffix = '-focus') {
  const scheme = {};
  const getValue = (name, suffix) => wrapVar(name, prefix, suffix);

  names.forEach((name) => {
    scheme[name] = getValue(name);
    scheme[name + suffix] = getValue(name + suffix);
  });

  return scheme;
}

function wrapVar(name, prefix = '', suffix = '') {
  const cssVar = prefix + name + suffix;
  return `var(${cssVar})`;
}
