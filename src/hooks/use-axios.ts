import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
  AxiosInstance,
} from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector } from '.';

import { selectAuth } from '@/stores';
import { useRefreshMutation } from '@/stores/auth/auth-api';

export type Response<TResponse> =
  | { response: AxiosResponse<TResponse>; error: undefined }
  | { response: undefined; error: AxiosError };

type RequestMethod<TResponse, TBody = undefined> = ((
  path: string,
  body: TBody,
  config?: AxiosRequestConfig
) => Promise<AxiosResponse<TResponse>>) &
  ((
    path: string,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<TResponse>>);

/**
 * @note
 * if response is not undefined then the error is and vice-versa,
 * use this guard after finish loading for safe-type usage of response and error
 */
export function hasResponse<TResponse>(
  response: AxiosResponse<TResponse> | undefined,
  error: AxiosError | undefined
): response is AxiosResponse<TResponse> {
  return error === undefined;
}

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
    {
      isUninitialized,
      isError: isRefreshError,
      isLoading: isRefreshLoading,
      error: refreshError,
    },
  ] = useRefreshMutation();
  const [res, setRes] = useState<Response<TResponse>>({
    response: undefined,
    error: new AxiosError(),
  });
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoaded = (res: AxiosResponse<TResponse>) => {
    setLoading(false);

    return res;
  };
  const handleRequest = async () => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: withAuth ? `Bearer ${token}` : undefined,
        },
      };

      const response = await (body
        ? requestMethod(path, body, config)
        : requestMethod(path, config)
      ).then(handleLoaded);

      setRes({ response, error: undefined });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (withAuth && error.status === HttpStatusCode.Unauthorized) {
          navigate('/login', { state: { from: location } });
        } else {
          setRes({ response: undefined, error: error });
        }

        setLoading(false);
      }
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
    } else if (
      isRefreshError &&
      refreshError &&
      'status' in refreshError &&
      refreshError.status === HttpStatusCode.Unauthorized
    ) {
      navigate('/login', { state: { from: location } });
    } else if (!isRefreshLoading) {
      handleRequest();
    }
  }, [isUninitialized, isRefreshLoading]);

  return [isLoading, res];
};

/**
 * @example
 * import {axiosClient, useAxios} from '@/hooks';
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
  body?: TBody
) => useHelper(requestMethod, path, body, false);

/**
 * @example
 * import { useAxios } from '@/hooks';
 *
 * const [isLoading, {response, error}] =
 *    useAxios<TResponse, TBody>('post', path, body);
 * // or
 * const [isLoading, {response, error}] =
 *    useAxios<TResponse, TBody>('get', path);
 */
export const useAltAxios = <TResponse, TBody = undefined>(
  method: keyof AxiosInstance,
  path: string,
  body?: TBody
) => {
  const requestMethod = axiosClient[method] as RequestMethod<TResponse, TBody>;
  return useHelper(requestMethod, path, body, false);
};

/**
 * @example
 * import {axiosClient, useAxios} from '@/hooks';
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
  body?: TBody
) => useHelper(requestMethod, path, body, true);

/**
 * @example
 * import { useAxiosWithAuth } from '@/hooks';
 *
 * const [isLoading, {response, error}] =
 *    useAxiosWithAuth<TResponse, TBody>('post', path, body);
 * // or
 * const [isLoading, {response, error}] =
 *    useAxiosWithAuth<TResponse, TBody>('get', path);
 */
export const useAltAxiosWithAuth = <TResponse, TBody = undefined>(
  method: keyof AxiosInstance,
  path: string,
  body?: TBody
) => {
  const requestMethod = axiosClient[method] as RequestMethod<TResponse, TBody>;
  return useHelper(requestMethod, path, body, false);
};
