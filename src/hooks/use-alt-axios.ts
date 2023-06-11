import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
  Method,
} from 'axios';
import { dequal as deepEqual } from 'dequal/lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector } from '.';

import { selectAuth } from '@/stores';
import { useRefreshMutation } from '@/stores/auth/auth-api';

const defaultOptions: Options = { withAuth: true, manual: false };
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

export function useAltAxios<
  TResponse = unknown,
  TBody = unknown,
  TError = unknown
>(
  _config: ConfigArgs<TBody>,
  _opts?: Options
): UseAxiosResult<TResponse, TBody, TError> {
  // states
  const config = useMemo(
    () => configToObject(_config),
    useDeepCompareMemoize(_config)
  );
  const options = useMemo(
    () => ({ ...defaultOptions, ..._opts }),
    useDeepCompareMemoize(_opts)
  );

  const [res, setRes] = useState<ResponseValues<TResponse, TBody, TError>>({
    loading: true,
  });

  // for maneuvering
  const navigate = useNavigate();
  const location = useLocation();

  // for auth
  const { token, expires } = useSelector(selectAuth);
  const [
    refresh,
    { isUninitialized, isError, isLoading, error: refreshError },
  ] = useRefreshMutation();

  // spread vars
  const { url = '', data } = config;
  const { withAuth, manual } = options;

  useEffect(() => {
    if (manual) return;

    if (!withAuth) {
      executeRequest();
    } else {
      executeAuthRequest();
    }
  }, [isUninitialized, isLoading]);

  async function executeRequest() {
    try {
      const configWithAuth: AxiosRequestConfig = {
        ...config,
        headers: {
          Authorization: withAuth ? `Bearer ${token}` : undefined,
        },
      };
      const requestMethod = axiosClient[config.method];

      await (data
        ? requestMethod(url, data, configWithAuth)
        : requestMethod(url, configWithAuth)
      ).then((res) =>
        setRes((prev) => ({
          ...prev,
          data: res.data,
          response: res,
          loading: false,
        }))
      );
    } catch (error) {
      if (!(error instanceof AxiosError)) return;

      if (withAuth && error.status === HttpStatusCode.Unauthorized) {
        navigate('/login', { state: { from: location } });
      }

      setRes((prev) => ({
        ...prev,
        loading: false,
        error: error as AxiosError<TError, TBody>,
      }));
    }
  }

  async function executeAuthRequest() {
    const isTokenInvalid =
      !token || (!!expires && Date.now() >= expires * 1000);

    if (isUninitialized && isTokenInvalid) {
      refresh(undefined);
    } else if (
      isError &&
      refreshError &&
      'status' in refreshError &&
      refreshError.status === HttpStatusCode.Unauthorized
    ) {
      navigate('/login', { state: { from: location } });
    } else if (!isLoading) {
      await executeRequest();
    }
  }

  const refetch = useCallback(() => {
    return withAuth ? executeAuthRequest() : executeRequest();
  }, [config]);

  return [res, refetch];
}

//#region HELPERS ----------------------------------------
function configToObject<TBody>(args: ConfigArgs<TBody>): RequestConfig<TBody> {
  return typeof args === 'string' ? { url: args, method: 'get' } : args;
}

function useDeepCompareMemoize<T>(value?: T) {
  const ref = useRef<T>();
  const signalRef = useRef(0);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  return [signalRef.current];
}
//#endregion

//#region TYPES ----------------------------------------
type ResponseValues<TResponse, TBody, TError> = {
  data?: TResponse;
  loading: boolean;
  response?: AxiosResponse<TResponse, TBody>;
  error?: AxiosError<TError, TBody>;
};

type HTTPMethod = Extract<keyof AxiosInstance, Method>;

export type UseAxiosResult<TResponse, TBody, TError> = [
  ResponseValues<TResponse, TBody, TError>,
  () => Promise<void>
];

type Options = {
  withAuth?: boolean;
  manual?: boolean;
};

type RequestConfig<
  TBody = unknown,
  TRequestMethod extends keyof AxiosInstance = HTTPMethod
> = AxiosRequestConfig<TBody> & { method: TRequestMethod };

type ConfigArgs<TBody> = string | RequestConfig<TBody>;
//#endregion
