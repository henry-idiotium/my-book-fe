import type { Meta } from '@storybook/react';
import { RiHome7Fill } from 'react-icons/ri';
import { withRouter } from 'storybook-addon-react-router-v6';

import { NavItem, NavItemProps } from './nav-item';

const Story: Meta<typeof NavItem> = {
  component: NavItem,
  title: 'NavItem',
  decorators: [withRouter],
  parameters: {
    reactRouter: {
      routePath: '/home',
    },
  },
};

export default Story;

export const Primary: { args: NavItemProps } = {
  args: {
    to: '/home',
    name: 'home',
    icon: RiHome7Fill,
  },
};
