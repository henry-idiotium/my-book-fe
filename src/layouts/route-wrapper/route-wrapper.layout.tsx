/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Navigate,
  Outlet,
  matchRoutes as getMatchRoutes,
  useLocation,
} from 'react-router-dom';

import { useSelector } from '@/hooks';
import router from '@/pages/router';
import { selectAuth } from '@/stores';

export interface RouteWrapperProps {
  type?: 'public' | 'private' | 'custom';
}

// DEPRECATED: currently using the usePageMeta hook
export function RouteWrapper({ type = 'custom' }: RouteWrapperProps) {
  const location = useLocation();

  const { token } = useSelector(selectAuth);

  const path = location.pathname ?? '/';

  switch (type) {
    case 'public': {
      const from = String(location.state?.from?.pathname ?? '/home');

      return token ? <Navigate to={from} /> : <Outlet />;
    }

    case 'private': {
      const isMatchRoot = path === '/';

      if (token) return isMatchRoot ? <Navigate to="/home" /> : <Outlet />;

      // Remarks:
      // this is just to make sure that it not accidentally match private case
      // when comming from public routes.
      if (isMatchRoot) {
        const matchedPaths = getMatchRoutes(router.routes, path)?.map(
          (ar) => ar.route.path
        );

        //@ts-ignore
        const isMatchPublicRoute = publicRoutes.some((pr) =>
          matchedPaths?.includes(pr.path)
        );

        if (isMatchPublicRoute) return <Outlet />;
      }

      return (
        <Navigate to="/login" replace={false} state={{ from: location }} />
      );
    }

    default:
      return <Outlet />;
  }
}

export default RouteWrapper;
