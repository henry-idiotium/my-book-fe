import { createBrowserRouter } from 'react-router-dom';

import { lazyLoad } from '@/utils';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: lazyLoad(() => import('@/app')),
    children: [
      {
        path: 'messages',
        element: lazyLoad(() => import('./messages/messages')),
      },
    ],
  },
]);

export default routes;
