import axios, { AxiosError, HttpStatusCode } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { argsToObject, configToObject, useBaseAxios } from './helpers';
import {
  UseAxiosConfigArgs,
  UseAxiosOptions,
  UseAxiosRefetch,
  UseAxiosRequestConfig,
  UseAxiosResponseValues,
  UseAxiosResult,
  UseMultiAxiosArgs,
} from './types';

export const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

const defaultOptions: UseAxiosOptions = { useAuth: true, manual: false };

/**
 * Axios hook adapter that provide a rich response.
 *
 * @param {UseAxiosConfigArgs<TBody>} _config
 *    The request configuration object.
 * @param {UseAxiosOptions} [_opts]
 *    Additional options.
 *
 * @returns {UseAxiosResult<TResponse, TBody, TError>}
 *    A tuple containing the response and a refetch function.
 */
export function useAxios<
  TResponse = unknown,
  TBody = unknown,
  TError = unknown
>(
  _config: UseAxiosConfigArgs<TBody>,
  _opts?: UseAxiosOptions
): UseAxiosResult<TResponse, TBody, TError> {
  // Convert arguments to actual useable configs
  const config = configToObject(_config);
  const options = { ...defaultOptions, ..._opts };

  // to redirect
  const navigate = useNavigate();
  const location = useLocation();

  const [response, setResponse] = useState<
    UseAxiosResponseValues<TResponse, TBody, TError>
  >({ loading: true });

  // get request auth guard logic
  const [{ refreshUninit, isRefreshing }, executeAuthAwareRequest] =
    useBaseAxios<TResponse, TBody>();

  // Automatically execute request on component mount and auth state changes.
  useEffect(() => {
    if (options.manual) return;

    executeRequest(config);
  }, [refreshUninit, isRefreshing, isRefreshing]);

  // Request execute logic
  async function executeRequest(config: UseAxiosRequestConfig<TBody>) {
    try {
      const res = await executeAuthAwareRequest<TResponse, TBody>(
        config,
        options.useAuth
      );

      setResponse((prev) => ({
        ...prev,
        data: res?.data,
        response: res,
        loading: false,
      }));
    } catch (error) {
      if (!(error instanceof AxiosError)) return;

      if (options.useAuth && error.status === HttpStatusCode.Unauthorized) {
        navigate('/login', { state: { from: location } });
      }

      setResponse((prev) => ({
        ...prev,
        loading: false,
        error: error as AxiosError<TError, TBody>,
      }));
    }
  }

  // Execute request function for user of useAxxios.
  // Perform request execution with overridable config argument.
  const refetch = useCallback<UseAxiosRefetch<TBody>>(
    (configOverrideArgs) => {
      let overridedConfig = { ...config };

      if (configOverrideArgs) {
        const configOverride = configToObject(configOverrideArgs);
        overridedConfig = { ...overridedConfig, ...configOverride };

        if (configOverride.url) {
          overridedConfig.url =
            (overridedConfig.url ?? '') + configOverride.url;
        }
      }

      setResponse((prev) => ({ ...prev, loading: true }));

      return executeRequest(overridedConfig);
    },
    [config]
  );

  return [response, refetch];
}

/**
 * Provide a function to call multiple requests.
 * @deprecated
 */
export function useRequest(args: UseMultiAxiosArgs = '') {
  const { baseUrl = '', useAuth = true } = argsToObject(args);

  const navigate = useNavigate();
  const location = useLocation();

  const [, executeAuthAwareRequest] = useBaseAxios();

  async function executeRequest<TResponse = unknown, TBody = unknown>(
    _config: string | RequiredPick<UseAxiosRequestConfig<TBody>, 'url'>
  ) {
    const config = configToObject(_config);
    config.url = baseUrl + (config.url ?? '');

    try {
      return await executeAuthAwareRequest<TResponse, TBody>(config, useAuth);
    } catch (error) {
      if (!(error instanceof AxiosError)) return;

      if (useAuth && error.status === HttpStatusCode.Unauthorized) {
        navigate('/login', { state: { from: location } });
      }
    }
  }

  return executeRequest;
}
