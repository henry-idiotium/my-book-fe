import type { Meta } from '@storybook/react';
import { RiHome7Fill } from 'react-icons/ri';

import { NavItem, NavItemProps } from './nav-item';

const Story: Meta<typeof NavItem> = {
  component: NavItem,
  title: 'NavItem',
};

export default Story;

export const Primary: { args: NavItemProps } = {
  args: {
    name: 'home',
    icon: RiHome7Fill,
  },
};
