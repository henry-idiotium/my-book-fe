import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { LoadingScreen } from './components';
import router from './pages/router';
import { selectAuth } from './stores';
import { useRefreshMutation } from './stores/auth/auth.api';

import { useThemeWatcher } from '@/hooks';

export function App() {
  useThemeWatcher();
  const { token } = useSelector(selectAuth);
  const [refresh, { isUninitialized, isLoading }] = useRefreshMutation();

  useEffect(() => {
    if (!token) refresh(undefined);
  }, []);

  if ((!token && isUninitialized) || isLoading) return <LoadingScreen />;

  return <RouterProvider router={router} />;
}

export default App;
