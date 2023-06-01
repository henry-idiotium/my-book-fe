import '@/styles/tailwinds.css';
import '@/styles/_theme-variables.scss';

import { Preview } from '@storybook/react';

import {
  withThemeAccentAdapter,
  withThemeBaseAdapter,
} from './src/decorators/with-theme-adapter';

import { THEME_CONFIG } from '@/stores';

const preview: Preview = {
  decorators: [withThemeBaseAdapter, withThemeAccentAdapter],
  globalTypes: {
    'theme-base': {
      description: 'Global theme base configuration for components',
      defaultValue: THEME_CONFIG.BASE[0],
      toolbar: {
        title: 'Base Theme',
        icon: 'circlehollow',
        items: THEME_CONFIG.BASE,
        dynamicTitle: true,
      },
    },
    'theme-accent': {
      description: 'Global theme accent configuration for components',
      defaultValue: THEME_CONFIG.ACCENT[0],
      toolbar: {
        title: 'Accent Theme',
        icon: 'circlehollow',
        items: THEME_CONFIG.ACCENT,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
