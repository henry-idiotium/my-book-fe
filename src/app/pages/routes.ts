import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { lazyLoad } from '@/utils';

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: lazy(() => import('@/app')),
    children: [
      { path: '/', element: lazyLoad(() => import('@/nx-welcome')) },
      {
        path: '/product',
        element: lazyLoad(() => import('./product/product')),
      },
    ],
  },
]);

export default routes;
