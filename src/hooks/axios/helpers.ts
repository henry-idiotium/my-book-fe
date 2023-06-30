import { AxiosResponse, HttpStatusCode } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUpdateEffect } from 'usehooks-ts';

import { axiosClient, useSelector } from '..';

import {
  FullMultiAxiosArgs,
  UseAxiosConfigArgs,
  UseAxiosRequestConfig,
  UseMultiAxiosArgs,
} from './types';

import { selectAuth } from '@/stores';
import { useRefreshMutation } from '@/stores/auth/auth.api';

/**
 * An abstract function that provide auth response
 * and request execution function.
 */
export function useBaseAxios<
  TGlobalResponse = unknown,
  TGlobalBody = unknown
>() {
  const navigate = useNavigate();
  const location = useLocation();

  const [
    { token, expires, refreshUninit, isRefreshing, refreshError },
    refresh,
  ] = useAuthGuard();

  /**
   * Handle requests according to authentication requirements.
   */
  function executeAuthAwareRequest<TRes, TBody>(
    config: UseAxiosRequestConfig<TBody>,
    useAuth?: boolean
  ) {
    if (useAuth) {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      };
      return executeRequestWithAuthGuard<TRes, TBody>(config);
    }
    return executeRequest<TRes, TBody>(config);
  }

  /**
   * Executes request with authentication guard checks.
   */
  function executeRequestWithAuthGuard<TRes, TBody>(
    config: UseAxiosRequestConfig<TBody>
  ) {
    const isTokenInvalid =
      !token || (!!expires && Date.now() >= expires * 1000);

    if (refreshUninit && isTokenInvalid) {
      refresh(undefined);
    } else if (
      refreshError &&
      'status' in refreshError &&
      refreshError.status === HttpStatusCode.Unauthorized
    ) {
      navigate('/login', { state: { from: location } });
    } else if (!isRefreshing) {
      return executeRequest<TRes, TBody>(config);
    }
  }

  function executeRequest<TRes = TGlobalResponse, TBody = TGlobalBody>(
    config: UseAxiosRequestConfig<TBody>
  ) {
    return axiosClient<TRes, AxiosResponse<TRes, TBody>, TBody>(config);
  }

  return [
    { token, expires, refreshUninit, isRefreshing, refreshError },
    executeAuthAwareRequest,
  ] as const;
}

/**
 * Fetch and request auth info.
 */
export function useAuthGuard() {
  const auth = useSelector(selectAuth);
  const [
    refresh,
    {
      isUninitialized: refreshUninit,
      isLoading: isRefreshing,
      error: refreshError,
    },
  ] = useRefreshMutation();

  useUpdateEffect(() => {
    console.log('✨✨🔒 Auth Changes 🔒✨✨\n', auth);
  }, [auth]);

  return [
    { ...auth, refreshUninit, isRefreshing, refreshError },
    refresh,
  ] as const;
}

/**
 * Convert arguments of string and object into
 * request config object ({@link UseAxiosRequestConfig}).
 */
export function configToObject<TBody>(
  args: UseAxiosConfigArgs<TBody>
): UseAxiosRequestConfig<TBody> {
  return typeof args === 'string' ? { url: args, method: 'get' } : args;
}

/**
 * Convert arguments of string and object into
 * {@link FullMultiAxiosArgs}.
 */
export function argsToObject(args: UseMultiAxiosArgs): FullMultiAxiosArgs {
  return typeof args === 'string' ? { baseUrl: args, useAuth: true } : args;
}
