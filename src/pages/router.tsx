import { RouteObject, createBrowserRouter } from 'react-router-dom';

import Friends from './friends/friends.page';
import Home from './home/home.page';
import Login from './login/login.page';
import Messages from './messages/messages.page';

import { PageMeta } from '@/components';
import Root from '@/layouts/root/root.layout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { path: '/home', Component: Home },
      { path: '/messages/*', Component: Messages },
      { path: '/friends', Component: Friends },
      { path: '/login', Component: Login },

      // todo: provide a user profile page
      { path: '/*', element: <>This should be a User Profile page</> },

      // Note: Mock pages
      ...eps('explore', 'lists', 'bookmarks', 'profile', 'notifications'),
    ],
  },
]);

export default router;

// ---------------------------------------
//#region Note: empty page, short hand
// for empty page delete later
function eps(...ns: string[]) {
  return ns.map<RouteObject>((n) => ({ path: '/' + n, Component: ep(n) }));
}

function ep(name: string) {
  return () => (
    <PageMeta title={name} auth={{ type: 'private' }}>
      <div className="m-10">
        <span className="text-2xl font-bold capitalize">{name} page</span>
        <br />
        <span className="text-base font-bold text-red-400">Not Implemted</span>
      </div>
    </PageMeta>
  );
}
//#endregion
