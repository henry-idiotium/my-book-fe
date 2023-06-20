import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';

/**
 * Contain all HTTP method keys in a AxiosInstance.
 */
type HTTPMethod = Extract<keyof AxiosInstance, Method>;

/**
 * This is a axios's RequestConfig adapter type.
 * It have better typing for method property.
 */
export type UseAxiosRequestConfig<
  TBody = unknown,
  TRequestMethod extends keyof AxiosInstance = HTTPMethod
> = AxiosRequestConfig<TBody> & { method: TRequestMethod };

/**
 * Used in useAxios parameters for config.
 * It's the first/main parameter of the hook.
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
  error?: AxiosError<TError, TBody>;
};

/**
 * One of the return value type in UseAxiosResult.
 * It's a function type for manually call/recall request.
 */
export type UseAxiosRefetch<TBody> = (
  configOverride?: UseAxiosConfigArgs<TBody>
) => Promise<void>;

/**
 * Used in useAxios parameters for options.
 */
export type UseAxiosOptions = {
  useAuth?: boolean;
  manual?: boolean;
};

/**
 * Return value of useAxios.
 */
export type UseAxiosResult<TResponse, TBody, TError> = [
  UseAxiosResponseValues<TResponse, TBody, TError>,
  UseAxiosRefetch<TBody>
];

export type UseMultiAxiosArgs = string | FullMultiAxiosArgs;
export type FullMultiAxiosArgs = {
  baseUrl?: string;
  useAuth?: boolean;
};
