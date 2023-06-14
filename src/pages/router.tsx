import { RouteObject, createBrowserRouter } from 'react-router-dom';

import Friends from './friends/friends.page';
import Home from './home/home.page';
import Login from './login/login.page';
import Messages from './messages/messages.page';

import Root from '@/layouts/root/root.layout';
import RouteWrapper from '@/layouts/route-wrapper/route-wrapper.layout';

export const privateRoutes: RouteObject[] = [
  { path: '/', element: <>this is private!!!</> },
  { path: '/home', Component: Home },
  { path: '/messages/*', Component: Messages },
  { path: '/friends', Component: Friends },

  // Note: Mock pages
  ...eps('explore', 'lists', 'bookmarks', 'profile', 'notifications'),
];
export const publicRoutes: RouteObject[] = [
  { path: '/', element: <>this is public!!!</> },
  { path: '/foo', element: <>this is public!!! foo</> },
  { path: '/login', Component: Login },
];

export const router = createBrowserRouter([
  {
    Component: Root,
    children: [
      { element: <RouteWrapper type="public" />, children: publicRoutes },
      { element: <RouteWrapper type="private" />, children: privateRoutes },
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
