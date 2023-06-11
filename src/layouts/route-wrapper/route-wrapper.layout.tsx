import {
  Navigate,
  Outlet,
  matchRoutes as getMatchRoutes,
  useLocation,
} from 'react-router-dom';

import { useSelector } from '@/hooks';
import router, { publicRoutes } from '@/pages/router';
import { selectAuth } from '@/stores';

export interface RouteWrapperProps {
  type?: 'public' | 'private' | 'custom';
}

// Todo: refac to use hook instead
export function RouteWrapper({ type = 'custom' }: RouteWrapperProps) {
  const location = useLocation();

  const { token } = useSelector(selectAuth);

  const path = location.pathname ?? '/';

  switch (type) {
    case 'public': {
      return token ? <Navigate to="/home" replace={false} /> : <Outlet />;
    }

    case 'private': {
      const isMatchRoot = path === '/';

      if (token)
        return isMatchRoot ? (
          <Navigate to="/home" replace={false} />
        ) : (
          <Outlet />
        );

      // Remarks:
      // this is just to make sure that it not accidentally match private case
      // when comming from public routes.
      if (isMatchRoot) {
        const matchedPaths = getMatchRoutes(router.routes, path)?.map(
          (ar) => ar.route.path
        );

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
