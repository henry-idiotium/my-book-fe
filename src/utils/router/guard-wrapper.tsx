/* eslint-disable react-hooks/rules-of-hooks */
import { Navigate, Outlet } from 'react-router-dom';

import { useLocation, useSelector } from '@/hooks';
import { selectAuth } from '@/stores';

const ROUTE_ROOT = '/';
const ROUTE_LOGIN = '/login';
const ROUTE_HOME = '/home';

type GuardWrapperArgs = {
  type: 'private' | 'public' | 'custom';
};

/** Authentication guard wrapper for route children. */
export const guardWrapper = (args: GuardWrapperArgs) => () => {
  const { type: authType } = args;

  const location = useLocation();

  const { token } = useSelector(selectAuth);

  // auth guard ------
  const path = location.pathname ?? ROUTE_ROOT;
  const isMatchRoot = path === ROUTE_ROOT;
  const validAuth = !!token;
  const from = location.state?.from?.pathname;

  switch (authType) {
    case 'public': {
      return validAuth ? <Navigate to={from ?? ROUTE_HOME} /> : <Outlet />;
    }
    case 'private': {
      if (!validAuth) {
        return <Navigate to={ROUTE_LOGIN} state={{ from: location }} />;
      } else if (isMatchRoot) {
        return <Navigate to={ROUTE_HOME} />;
      }
      break;
    }
    case 'custom': {
      if (validAuth && isMatchRoot) return <Navigate to={ROUTE_HOME} />;
      break;
    }
  }

  return <Outlet />;
};

export default guardWrapper;
