import type { Meta } from '@storybook/react';
import { IconBaseProps } from 'react-icons';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { RiMailFill, RiMailLine } from 'react-icons/ri';
import { withRouter } from 'storybook-addon-react-router-v6';

import { NavBar, NavBarProps } from './nav-bar';

export default {
  component: NavBar,
  title: 'NavBar',
  decorators: [withRouter],
  parameters: {
    reactRouter: {
      routePath: '/messages',
    },
  },
} satisfies Meta<typeof NavBar>;

export const Primary: { args: NavBarProps } = {
  args: {
    scheme: [
      {
        to: '/home',
        name: 'home',
        icon: AiOutlineHome,
        activeIcon: AiFillHome,
      },
      {
        to: '/messages',
        name: 'messages',
        icon: RiMailLine,
        activeIcon: RiMailFill,
      },
    ],
  },
};
