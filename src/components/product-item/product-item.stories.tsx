import type { Meta } from '@storybook/react';

import { ProductItem } from './product-item';

const Story: Meta<typeof ProductItem> = {
  component: ProductItem,
  title: 'ProductItem',
};

export default Story;

export const Primary = {
  args: {},
};
