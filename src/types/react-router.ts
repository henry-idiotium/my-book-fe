import { RouteObject } from 'react-router-dom';

export type PageRoutes = PageRoute[];
export type PageRoute = RouteObject & {
  meta?: PageMeta;
};

export type RouteAuthType = 'public' | 'private' | 'custom';
type PageMeta = {
  title?: string;
  authType?: RouteAuthType;
};

export const isPageRoute = (
  route: RouteObject | PageRoute,
): route is PageRoute => 'meta' in route;
