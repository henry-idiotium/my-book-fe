import type { Meta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import { NavBar } from './nav-bar';

export default {
  component: NavBar,
  title: 'NavBar',
  decorators: [withRouter],
  parameters: {
    reactRouter: {
      routePath: '/home',
    },
  },
} satisfies Meta<typeof NavBar>;

export const Primary = {
  args: {},
};
