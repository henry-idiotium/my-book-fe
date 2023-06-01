import type { Meta } from '@storybook/react';

import { Product } from './product.page';

const Story: Meta<typeof Product> = {
  component: Product,
  title: 'Product',
};

export default Story;

export const Primary = {
  args: {},
};
