import { AxiosResponse, HttpStatusCode } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

import { selectAuth } from '@/stores';
import { useRefreshMutation } from '@/stores/auth/auth.api';

import { axiosClient, useSelector } from '../..';
import { UseAxiosOptions, UseAxiosRequestConfig } from '../types';

/**
 * An abstract function that provide auth response
 * and request execution function.
 */
export function useBaseAxios<
  TGlobalResponse = unknown,
  TGlobalBody = unknown,
>() {
  const navigate = useNavigate();
  const location = useLocation();

  const [authData, refresh] = useAuthGuard();

  const { token, expires, refreshUninitialized, isRefreshing, refreshError } =
    authData;

  /** Actual request logic. */
  function executeRequest<TRes = TGlobalResponse, TBody = TGlobalBody>(
    config: UseAxiosRequestConfig<TBody>,
  ) {
    return axiosClient<TRes, AxiosResponse<TRes, TBody>, TBody>(config);
  }

  /** Executes request with authentication guard checks. */
  async function executeRequestWithAuthGuard<TRes, TBody>(
    config: UseAxiosRequestConfig<TBody>,
  ) {
    const tokenIsInvalid = !token || (expires && Date.now() >= expires * 1000);
    const authFailed =
      refreshError &&
      'status' in refreshError &&
      refreshError.status === HttpStatusCode.Unauthorized;

    if (refreshUninitialized && tokenIsInvalid) {
      refresh(undefined);
    } else if (authFailed) {
      navigate('/login', { state: { from: location } });
    } else if (!isRefreshing) {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      };

      return await executeRequest<TRes, TBody>(config);
    }
  }

  /**
   * Handle requests according to authentication requirements.
   * @remarks for user of {@link useBaseAxios}
   */
  function executeAuthAwareRequest<TRes, TBody>(
    config: UseAxiosRequestConfig<TBody>,
    options: UseAxiosOptions,
  ) {
    const execute = options.useAuth
      ? executeRequestWithAuthGuard
      : executeRequest;

    return execute<TRes, TBody>(config);
  }

  return [authData, executeAuthAwareRequest] as const;
}

/** Fetch and request auth info. */
function useAuthGuard() {
  const auth = useSelector(selectAuth);
  const [refresh, { isUninitialized, isLoading, error }] = useRefreshMutation();

  const authInfo = {
    ...auth,
    refreshUninitialized: isUninitialized,
    isRefreshing: isLoading,
    refreshError: error,
  };

  return [authInfo, refresh] as const;
}
