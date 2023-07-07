import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { useEffectOnce } from 'usehooks-ts';

import { useThemeWatcher } from '@/hooks';

import { LoadingScreen } from './components';
import router from './pages/router';
import { selectAuth } from './stores';
import { useRefreshMutation } from './stores/auth/auth.api';

export function App() {
  useThemeWatcher();

  const { token } = useSelector(selectAuth);
  const [refresh, { isUninitialized, isLoading }] = useRefreshMutation();

  useEffectOnce(() => {
    if (!token) refresh(undefined);
  });

  if ((!token && isUninitialized) || isLoading) return <LoadingScreen />;

  return <RouterProvider router={router} />;
}

export default App;
