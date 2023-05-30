import type { Meta } from '@storybook/react';
import { NavBar } from './nav-bar';

const Story: Meta<typeof NavBar> = {
  component: NavBar,
  title: 'NavBar',
};
export default Story;

export const Primary = {
  args: {},
};
