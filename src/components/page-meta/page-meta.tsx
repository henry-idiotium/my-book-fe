import { Navigate } from 'react-router-dom';
import { useDocumentTitle } from 'usehooks-ts';

import { useLocation, useSelector } from '@/hooks';
import { selectAuth } from '@/stores';

const APP_NAME = import.meta.env.VITE_APP_NAME;
const APP_TITLE_SEP = ' / ';
const routes = {
  ROOT: '/',
  LOGIN: '/login',
  HOME: '/home',
};

type PageMetaProps = React.PropsWithChildren & {
  title?: string;
  auth: { type: AuthType };
};

export function PageMeta(props: PageMetaProps) {
  const { title = '', auth, children } = props;

  useDocumentTitle([APP_NAME, title].filter(Boolean).join(APP_TITLE_SEP));

  const location = useLocation();
  const { token } = useSelector(selectAuth);

  // auth guard
  const path = location.pathname ?? routes.ROOT;
  const isMatchRoot = path === routes.ROOT;
  const validAuth = !!token;

  const authHandlers: AuthHandlers = {
    public: () => {
      return validAuth ? <Navigate to={routes.HOME} /> : undefined;
    },

    private: () => {
      if (!validAuth) {
        return <Navigate to={routes.LOGIN} state={{ from: location }} />;
      }
      return isMatchRoot ? <Navigate to={routes.HOME} /> : undefined;
    },

    custom: () => {
      if (validAuth && isMatchRoot) {
        return <Navigate to={routes.HOME} />;
      }
    },
  };

  const redirect = authHandlers[auth.type]();

  return redirect ?? children;
}

export default PageMeta;

type AuthType = 'public' | 'private' | 'custom';
type AuthHandlers = {
  [key in AuthType]: () => React.ReactNode;
};
