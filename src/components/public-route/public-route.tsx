import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import LoadingScreen from '../loading-screen/loading-screen';

import { useSelector } from '@/hooks';
import { selectAuth } from '@/stores';
import { useRefreshMutation } from '@/stores/auth/auth-api';

export function PublicRoute() {
  const location = useLocation();
  const { token } = useSelector(selectAuth);
  const [refresh, { isSuccess, isUninitialized, isLoading }] =
    useRefreshMutation();
  const [shouldLoading, setShouldLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // refresh if not already do so in root layout
  useEffect(() => {
    if (!token) refresh(undefined);
  }, [location.pathname]);

  // sync with refetch
  useEffect(() => {
    if (isUninitialized && !isLoading) setShouldLoading(false);

    if (token && isSuccess) setShouldRedirect(true);
  }, [isSuccess, isUninitialized, isLoading]);

  if (shouldLoading) return <LoadingScreen />;

  if (shouldRedirect) {
    console.log({ token, isSuccess }, token && isSuccess);

    return <Navigate replace to="/home" state={undefined} />;
  }

  return <Outlet />;
}

export default PublicRoute;
