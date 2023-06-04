import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import LoadingScreen from '../loading-screen/loading-screen';

import { useSelector } from '@/hooks';
import { selectAuth } from '@/stores';
import { useRefreshMutation } from '@/stores/auth/auth-api';

export function ProtectedRoute() {
  const location = useLocation();
  const { token } = useSelector(selectAuth);
  const [refresh, { isSuccess, isUninitialized, isLoading }] =
    useRefreshMutation();

  useEffect(() => {
    // refresh if not already do so in root layout
    if (isUninitialized && token === '') refresh(undefined);
  }, [location.pathname]);

  if (isUninitialized || isLoading) {
    return <LoadingScreen />;
  } else if (!isSuccess && token === '') {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  if (location.pathname === '/') return <Navigate replace to="/home" />;

  return <Outlet />;
}

export default ProtectedRoute;
