import { RouteObject, createBrowserRouter } from 'react-router-dom';

import Home from './home/home.page';
import Login from './login/login.page';
import Messages from './messages/messages.page';

import App from '@/app';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { path: '/login', Component: Login },
      { path: '/home', Component: Home },
      { path: '/messages', Component: Messages },

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
