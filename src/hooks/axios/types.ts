import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import { z } from 'zod';

import { getZodDefault } from '@/utils';

/** Contain all HTTP method names in a AxiosInstance. */
type HTTPMethod = Extract<keyof AxiosInstance, Method>;

/**
 * This is a axios's RequestConfig adapter type.
 * @remarks It have better typing for method property.
 */
export type UseAxiosRequestConfig<
  TBody = unknown,
  TRequestMethod extends keyof AxiosInstance = HTTPMethod,
> = AxiosRequestConfig<TBody> & { method?: TRequestMethod };

/**
 * Used in useAxios parameters for config.
 * @remarks It's the first/main parameter of the hook.
 */
export type UseAxiosConfigArgs<TBody> = string | UseAxiosRequestConfig<TBody>;

/**
 * One of the return value type in UseAxiosResult.
 * It's the result object.
 */
export type UseAxiosResponseValues<TResponse, TBody, TError> = {
  data?: TResponse;
  loading: boolean;
  response?: AxiosResponse<TResponse, TBody>;
  error?: AxiosError<TError, TBody> | null;
};

/**
 * One of the return value type in UseAxiosResult.
 * It's a function type for manually call/recall request.
 */
export type UseAxiosRefetch<TBody> = (
  configOverride?: UseAxiosConfigArgs<TBody>,
) => Promise<void>;

/** Used in useAxios parameters for options. */
export type UseAxiosOptions = z.infer<typeof useAxiosOptionsPartialZod>;
const useAxiosOptionsZod = z.object({
  useAuth: z.boolean().default(true),
  autoCancel: z.boolean().default(true),
  manual: z.boolean(),
  autoAfterMountedFetch: z.boolean().default(true),
});
const useAxiosOptionsPartialZod = useAxiosOptionsZod.deepPartial();
export const defaultUseAxiosOptions = getZodDefault(useAxiosOptionsZod);

/** Return value of useAxios. */
export type UseAxiosResult<TResponse, TBody, TError> = [
  UseAxiosResponseValues<TResponse, TBody, TError>,
  UseAxiosRefetch<TBody>,
  () => void,
];

/** Callback function type for `withCancel` function. */
export type WithCancelTokenFunction<
  TBody = unknown,
  _Config = UseAxiosRequestConfig<TBody>,
> = (config: _Config) => _Config;
