import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import LoadingScreen from '../loading-screen/loading-screen';

import { useSelector } from '@/hooks';
// import { authRoutes } from '@/pages/router';
import { selectAuth } from '@/stores';
import { useRefreshMutation } from '@/stores/auth/auth-api';

export function ProtectedRoute() {
  const location = useLocation();
  const { token } = useSelector(selectAuth);
  const [refresh, { isSuccess, isUninitialized, isLoading }] =
    useRefreshMutation();
  const [shouldLoading, setShouldLoading] = useState(true);
  const [shouldLogin, setShouldLogin] = useState(false);

  useEffect(() => {
    // refresh if not already do so in root layout
    if (!token) refresh(undefined);
  }, [location.pathname]);

  // sync with refetch
  useEffect(() => {
    // if (!matchRoute) set

    if (token || (!isUninitialized && !isLoading)) setShouldLoading(false);

    if (!token || (!isUninitialized && !isSuccess)) setShouldLogin(true);
  }, [isSuccess, isUninitialized, isLoading]);

  if (shouldLoading) {
    return <LoadingScreen />;
  } else if (shouldLogin) {
    console.log('login', {
      token: !!token,
      isUninitialized,
      isSuccess,
    });

    return <Navigate replace to="/login" state={{ from: location }} />;
  }
  // redirect back to /home when in login
  else if (location.pathname === '/') return <Navigate replace to="/home" />;

  console.error(
    'this should not log',
    { token: !!token, isUninitialized, isSuccess },
    !token || (!isUninitialized && !isSuccess)
  );

  return <Outlet />;
}

export default ProtectedRoute;
