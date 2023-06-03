import type { Meta } from '@storybook/react';

import { LoadingScreen } from './loading-screen';

const Story: Meta<typeof LoadingScreen> = {
  component: LoadingScreen,
  title: 'LoadingScreen',
};

export default Story;

export const Primary = {
  args: {},
};
