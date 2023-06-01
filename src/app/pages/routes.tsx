import { RouteObject, createBrowserRouter } from 'react-router-dom';

import Login from './login/login';

import { lazyLoad } from '@/utils';

const homeRoute: Partial<RouteObject> = {
  element: lazyLoad(() => import('./home/home.page')),
};

export const routes = createBrowserRouter([
  {
    path: '/',
    element: lazyLoad(() => import('../layouts/root/root.layout')),
    children: [
      {
        path: 'messages',
        element: lazyLoad(() => import('./messages/messages.page')),
      },
      { path: '', ...homeRoute },
      { path: 'home', ...homeRoute },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
]);

export default routes;
