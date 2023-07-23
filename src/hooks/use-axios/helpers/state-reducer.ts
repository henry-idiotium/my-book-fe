import { AxiosError, AxiosResponse } from 'axios';
import { useMemo, useReducer } from 'react';

import { useDeepCompareMemoize as deepCompareMemo } from '@/hooks';

import {
  UseAxiosConfigArgs,
  UseAxiosOptions,
  UseAxiosRequestConfig,
  UseAxiosResponseValues,
} from '../types';

export function useStateReducer<TResponse, TBody, TError>(
  config: UseAxiosRequestConfig<TBody>,
  options: UseAxiosOptions,
) {
  const [hyperActiveResponse, dispatch] = useReducer(
    reducer<TResponse, TBody, TError>(),
    createInitialResponseState<TResponse, TBody, TError>(config, options),
  );
  const response = useMemo(() => hyperActiveResponse, deepCompareMemo(hyperActiveResponse));

  return [response, dispatch] as const;
}
export default useStateReducer;

function reducer<TResponse, TBody, TError>() {
  return (
    state: UseAxiosResponseValues<TResponse, TBody, TError>,
    action: ReducerAction<TResponse, TBody, TError>,
  ): UseAxiosResponseValues<TResponse, TBody, TError> => {
    switch (action.type) {
      case 'REQUEST_START':
        return { ...state, loading: true };

      case 'REQUEST_END':
        return {
          ...state,
          loading: false,
          data: action.payload?.data,
          response: action.payload,
        };

      case 'REQUEST_ERROR':
        return {
          ...state,
          loading: false,
          error: action.payload.error,
        };
    }
  };
}

function createInitialResponseState<TResponse, TBody, TError>(
  _config: UseAxiosConfigArgs<TBody>,
  options: UseAxiosOptions,
): UseAxiosResponseValues<TResponse, TBody, TError> {
  // const response = !options.manual && tryGetFromCache(config, options);
  return {
    loading: !options.manual,
    error: null,
    // loading: !options.manual && !response,
    // ...(response ? { data: response.data, response } : null),
  };
}

type ReducerAction<TResponse, TBody, TError> =
  | { type: 'REQUEST_START' }
  | { type: 'REQUEST_END'; payload?: AxiosResponse<TResponse, TBody> }
  | { type: 'REQUEST_ERROR'; payload: { error: AxiosError<TError, TBody> } };
