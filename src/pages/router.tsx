import { RouteObject, createBrowserRouter } from 'react-router-dom';

import { GuardWrapper, Root } from '@/layouts';

import Friends from './friends/friends.page';
import Home from './home/home.page';
import Login from './login/login.page';
import Messages from './messages/messages.page';

export const router = createBrowserRouter([
  {
    Component: Root,
    children: [
      {
        element: <GuardWrapper type="public" />,
        children: [
          { path: '/', element: <>this is public!!!</> },
          { path: '/foo', element: <>this is public!!! foo</> },
          { path: '/login', Component: Login },
        ],
      },
      {
        element: <GuardWrapper type="private" />,
        children: [
          { path: '/', element: <>this is private!!!</> },
          { path: '/home', Component: Home },
          { path: '/messages/*', Component: Messages },
          { path: '/friends', Component: Friends },

          // todo: provide a user (any user) profile page
          { path: '/*', element: <>This should be a User Profile page</> },

          // Note: Mock pages
          ...eps('explore', 'lists', 'bookmarks', 'profile', 'notifications'),
        ],
      },
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
    <div className="m-10">
      <span className="text-2xl font-bold capitalize">{name} page</span>
      <br />
      <span className="text-base font-bold text-red-400">
        Not Implemented Yet!!
      </span>
    </div>
  );
}
//#endregion
