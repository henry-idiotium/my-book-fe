import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector } from '.';

import { selectAuth } from '@/stores';
import { useRefreshMutation } from '@/stores/auth/auth-api';

export interface Response<TResponse> {
  response: AxiosResponse<TResponse> | undefined;
  error: unknown | undefined;
}

type RequestMethod<TResponse, TBody = undefined> =
  | ((
      path: string,
      body: TBody,
      config?: AxiosRequestConfig
    ) => Promise<AxiosResponse<TResponse>>)
  | ((
      path: string,
      config?: AxiosRequestConfig
    ) => Promise<AxiosResponse<TResponse>>);

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * @example
 * import {axiosClient, useAxios} from '@/hooks/use-axios.ts';
 * const [isLoading, {response, error}] = useAxios<TResponse, TBody>(axiosClient.post, path, body, withAuth);
 */
export const useAxios = async <TResponse, TBody = undefined>(
  requestMethod: RequestMethod<TResponse, TBody>,
  path: string,
  body?: TBody,
  withAuth = false
) => {
  const { token, expires } = useSelector(selectAuth);
  const [
    refresh,
    { isUninitialized, isError: isRefreshError, isLoading: isRefreshLoading },
  ] = useRefreshMutation();
  const [res, setRes] = useState<Response<TResponse>>({
    response: undefined,
    error: undefined,
  });
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLoaded = (_: AxiosResponse<TResponse>) => {
    setLoading(false);

    return _;
  };
  const handleRequest = async () => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: withAuth ? `Bearer ${token}` : undefined,
        },
      };

      let response: AxiosResponse<TResponse>;
      if (body) {
        response = await requestMethod(path, body, config).then(handleLoaded);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response = await requestMethod(path, config as any).then(handleLoaded);
      }

      setRes({ response, error: undefined });
    } catch (err) {
      setRes({ response: undefined, error: err });
    }
  };

  useEffect(() => {
    if (!withAuth) {
      handleRequest();
    } else if (isUninitialized && expires && Date.now() >= expires * 1000) {
      refresh(undefined);
    } else if (!isUninitialized && !isRefreshLoading && isRefreshError) {
      // navigate
      navigate('/login', { replace: true, state: { from: location.pathname } });
    } else if (!isRefreshLoading) {
      handleRequest();
    }
  }, [isUninitialized, isRefreshLoading]);

  return [isLoading, res];
};
