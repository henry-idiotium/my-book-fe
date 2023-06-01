import { createBrowserRouter } from 'react-router-dom';

import { lazyLoad } from '@/utils';
import Login from './login/login';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: lazyLoad(() => import('@/app')),
    children: [
      {
        path: 'messages',
        element: lazyLoad(() => import('./messages/messages')),
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
]);

export default routes;
