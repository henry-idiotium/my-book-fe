import axios, { AxiosError, HttpStatusCode } from 'axios';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Logger } from '@/utils';

import deepCompareMemo from '../use-deep-compare-memorize';

import { useBaseAxios, useStateReducer } from './helpers';
import {
  UseAxiosConfigArgs,
  UseAxiosOptions,
  UseAxiosRefetch,
  UseAxiosRequestConfig,
  UseAxiosResult,
  WithCancelTokenFunction,
  defaultUseAxiosOptions,
} from './types';

export const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

/** Axios hook adapter that provide a rich response. */
export function useAxios<TResponse = unknown, TBody = unknown, TError = unknown>(
  _config: UseAxiosConfigArgs<TBody>,
  _options?: UseAxiosOptions,
): UseAxiosResult<TResponse, TBody, TError> {
  // Convert arguments to useable configs.
  const config = useMemo(() => configToObject(_config), deepCompareMemo(_config));
  const options = useMemo(
    () => ({ ...defaultUseAxiosOptions, ..._options }),
    deepCompareMemo(_options),
  );

  const cancelSourceRef = useRef<AbortController>();

  const navigate = useNavigate();
  const location = useLocation();

  const [response, dispatch] = useStateReducer<TResponse, TBody, TError>(config, options);

  // get request auth guard logic
  const [{ refreshUninitialized, isRefreshing }, executeAuthAwareRequest] = useBaseAxios<
    TResponse,
    TBody
  >();

  /** Cancel Axios request. */
  const cancelRequest = useCallback(() => {
    if (!cancelSourceRef.current) return;
    cancelSourceRef.current.abort();
  }, []);

  /** Update Axios request config with new cancel token instance. */
  const withCancelToken = useCallback<WithCancelTokenFunction<TBody>>(
    (config) => {
      // Cancel the previous request (if any)
      if (options.autoCancel) cancelRequest();

      // Create a new cancel source
      cancelSourceRef.current = new AbortController();
      // Add the cancel token to the request config
      config.signal = cancelSourceRef.current.signal;

      return config;
    },
    [options.autoCancel],
  );

  // Automatically execute request on component mount and auth state changes.
  useEffect(() => {
    if (!options.manual) {
      executeRequest(withCancelToken(config));
    }

    return () => {
      if (options.autoCancel) cancelRequest();
    };
  }, [config, options, refreshUninitialized, isRefreshing]);

  /** Request execution logic. */
  async function executeRequest(config: UseAxiosRequestConfig<TBody>) {
    dispatch({ type: 'REQUEST_START' });

    await executeAuthAwareRequest<TResponse, TBody>(config, options)
      .then((res) => {
        if (!res) return;
        dispatch({ type: 'REQUEST_END', payload: res });
      })
      .catch((error) => {
        if (!(error instanceof AxiosError)) return Logger.error(error);
        if (error.code === AxiosError.ERR_CANCELED) return;

        Logger.error(error);

        if (error.response?.status === HttpStatusCode.Unauthorized) {
          navigate('/login', { state: { from: location } });
        }

        dispatch({ type: 'REQUEST_ERROR', payload: { error } });
      });
  }

  // Execute request function for user of useAxios.
  // Perform request execution with overridable config argument.
  const refetch = useCallback<UseAxiosRefetch<TBody>>(
    (_overrideConfig) => {
      let newConfig = { ...config };

      if (_overrideConfig) {
        const { url: overrideUrl, ...overrideConfig } = configToObject(_overrideConfig);

        if (overrideUrl) {
          newConfig.url = (newConfig.url ?? '') + overrideUrl;
        }

        newConfig = { ...newConfig, ...overrideConfig };
      }

      return executeRequest(withCancelToken(newConfig));
    },
    [config, withCancelToken],
  );

  return [response, refetch, cancelRequest];
}

/**
 * Convert arguments of string and object into
 * request config object ({@link UseAxiosRequestConfig}).
 */
function configToObject<TBody>(args: UseAxiosConfigArgs<TBody>): UseAxiosRequestConfig<TBody> {
  return typeof args === 'string' ? { url: args, method: 'get' } : args;
}
