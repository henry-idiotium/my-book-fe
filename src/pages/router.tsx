import { RouteObject, createBrowserRouter } from 'react-router-dom';

import Home from './home/home.page';
import Login from './login/login.page';
import Messages from './messages/messages.page';

import App from '@/app';
import { ProtectedRoute, PublicRoute } from '@/components';

export const authRoutes: RouteObject[] = [
  { path: '/home', Component: Home },
  { path: '/messages', Component: Messages },

  // Note: Mock pages
  ...eps('explore', 'lists', 'bookmarks', 'profile', 'notifications'),
];

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <>This is a pubilc routes</> },
  { path: '/login', Component: Login },
];

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { path: '/', Component: ProtectedRoute, children: authRoutes },
      { path: '/', Component: PublicRoute, children: publicRoutes },
    ],
  },
]);
export default router;

// ---------------------------------------
//#region Note: empty page, short hand
// for empty page delete later
function eps(...ns: string[]) {
  return ns.map<RouteObject>((n) => ({ path: '/' + n, element: ep(n) }));
}

function ep(n: string) {
  return (
    <div className="m-10">
      <span className="text-2xl font-bold capitalize">{n} page</span>
      <br />
      <span className="text-base font-bold text-red-400">Not Implemted</span>
    </div>
  );
}
//#endregion
