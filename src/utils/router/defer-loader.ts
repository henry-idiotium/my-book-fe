import {
  Await as ReactRouterAwait,
  defer,
  LoaderFunctionArgs,
  useLoaderData as useReactRouterLoaderData,
} from 'react-router-dom';

export function useLoaderData<TLoader extends ReturnType<typeof deferredLoader>>() {
  return useReactRouterLoaderData() as ReturnType<TLoader>['data'];
}

export function deferredLoader<TData extends Record<string, unknown>>(
  dataFunc: (args: LoaderFunctionArgs) => TData,
) {
  return (args: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData;
    };
}

export type AwaitResolveRenderFunction<T> = (data: Awaited<T>) => React.ReactElement;

export type AwaitProps<T> = {
  children: React.ReactNode | AwaitResolveRenderFunction<T>;
  errorElement?: React.ReactNode;
  resolve: Promise<T>;
};

export function Await<T>(props: AwaitProps<T>) {
  return ReactRouterAwait(props);
}
