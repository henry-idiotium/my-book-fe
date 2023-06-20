import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector } from '.';

import { selectAuth } from '@/stores';
import { setDocumentTitle } from '@/utils';

type PageMetaArgs = {
  title?: string;
  auth?: {
    type?: 'public' | 'private' | 'custom';
  };
};

export function usePageMeta(args: PageMetaArgs = {}) {
  const { title, auth = { type: 'custom' } } = args;

  const location = useLocation();
  const navigate = useNavigate();

  const { token } = useSelector(selectAuth);

  useEffect(() => {
    setDocumentTitle(title);
  }, []);

  useEffect(() => {
    const path = location.pathname ?? '/';

    switch (auth.type) {
      case 'public': {
        if (token) navigate(-1);
        break;
      }

      case 'private': {
        if (token) {
          if (path === '/') navigate('/home');
          break;
        }

        navigate('/login', { state: { from: location } });
        break;
      }

      case 'custom': {
        if (token) {
          if (path === '/') navigate('/home');
          break;
        }

        break;
      }

      default:
        break;
    }
  }, [location]);
}
