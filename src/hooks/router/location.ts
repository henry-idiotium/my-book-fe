import { Location as RouterLocation, useLocation as useRouterLocation } from 'react-router-dom';

export type PreviousLocationState = { from?: RouterLocation };
export type AppLocation<TState = PreviousLocationState> = {
  state?: TState;
} & Omit<RouterLocation, 'state'>;

type UseLocationFn = <TState = PreviousLocationState>() => AppLocation<TState>;

export const useLocation: UseLocationFn = <TState>() => {
  const location = useRouterLocation();

  return {
    ...location,
    state: location.state as TState | undefined,
  };
};
