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

const defaultOptions: UseAxiosOptions = { useAuth: true, manual: false };
export const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Perform axios HTTP methods with a rich response.
 */
export function useAxios<
  TResponse = unknown,
  TBody = unknown,
  TError = unknown
>(
  _config: UseAxiosConfigArgs<TBody>,
  _opts?: UseAxiosOptions
): UseAxiosResult<TResponse, TBody, TError> {
  const config = configToObject(_config);
  const options = { ...defaultOptions, ..._opts };

  const navigate = useNavigate();
  const location = useLocation();

  const [response, setResponse] = useState<
    UseAxiosResponseValues<TResponse, TBody, TError>
  >({ loading: true });

  const [{ refreshUninit, isRefreshing }, executeAuthAwareRequest] =
    useBaseAxios<TResponse, TBody>();

  // auto fetch
  useEffect(() => {
    if (options.manual) return;

    executeRequest(config);
  }, [refreshUninit, isRefreshing, isRefreshing]);

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
