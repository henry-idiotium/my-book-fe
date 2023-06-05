import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
} from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector } from '.';

import { selectAuth } from '@/stores';
import { useRefreshMutation } from '@/stores/auth/auth-api';

export interface Response<TResponse> {
  response: AxiosResponse<TResponse> | undefined;
  error: AxiosError | undefined;
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
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const useHelper = <TResponse, TBody = undefined>(
  requestMethod: RequestMethod<TResponse, TBody>,
  path: string,
  body?: TBody,
  withAuth = false
): [boolean, Response<TResponse>] => {
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
      if (
        withAuth &&
        (err as AxiosError).status === HttpStatusCode.Unauthorized
      ) {
        navigate('/login', { state: { from: location } });
      } else {
        setRes({ response: undefined, error: err as AxiosError });
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    if (!withAuth) {
      handleRequest();

      return;
    }

    const isTokenInvalid =
      !token || (!!expires && Date.now() >= expires * 1000);

    if (isUninitialized && isTokenInvalid) {
      refresh(undefined);
    } else if (!isUninitialized && !isRefreshLoading && isRefreshError) {
      navigate('/login', { state: { from: location } });
    } else if (!isRefreshLoading) {
      handleRequest();
    }
  }, [isUninitialized, isRefreshLoading]);

  return [isLoading, res];
};

/**
 * @example
 * import {axiosClient, useAxios} from '@/hooks/use-axios.ts';
 *
 * const [isLoading, {response, error}] =
 *    useAxios<TResponse, TBody>(axiosClient.post, path, body);
 * // or
 * const [isLoading, {response, error}]
 *    = useAxios<TResponse, TBody>(axiosClient.get, path);
 */
export const useAxios = <TResponse, TBody = undefined>(
  requestMethod: RequestMethod<TResponse, TBody>,
  path: string,
  body: TBody | undefined = undefined
) => {
  return useHelper(requestMethod, path, body, false);
};

/**
 * @example
 * import {axiosClient, useAxios} from '@/hooks/use-axios.ts';
 *
 * const [isLoading, {response, error}] =
 *    useAxiosWithAuth<TResponse, TBody>(axiosClient.post, path, body);
 * // or
 * const [isLoading, {response, error}] =
 *    useAxiosWithAuth<TResponse, TBody>(axiosClient.get, path);
 */
export const useAxiosWithAuth = <TResponse, TBody = undefined>(
  requestMethod: RequestMethod<TResponse, TBody>,
  path: string,
  body: TBody | undefined = undefined
) => {
  return useHelper(requestMethod, path, body, true);
};
