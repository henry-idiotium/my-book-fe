import { Decorator } from '@storybook/react';

export const withThemeBaseAdapter: Decorator = (Story, context) => {
  const baseValue = context.globals['theme-base'] as string;

  switch (baseValue) {
    case 'default': // light theme
      break;

    default:
      break;
  }

  document.documentElement.setAttribute('data-theme-base', baseValue);

  return <Story />;
};
export const withThemeAccentAdapter: Decorator = (Story, context) => {
  const accentValue = context.globals['theme-accent'] as string;

  document.documentElement.setAttribute('data-theme-accent', accentValue);

  return <Story />;
};
