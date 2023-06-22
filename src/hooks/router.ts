import {
  Location as RouterLocation,
  useLocation as useRouterLocation,
} from 'react-router-dom';

export type PreviousLocationState = { from?: RouterLocation };
export type AppLocation<TState = PreviousLocationState> = {
  state?: TState;
} & Omit<RouterLocation, 'state'>;

type UseLocation = <TState = PreviousLocationState>() => AppLocation<TState>;

export const useLocation: UseLocation = <TState>() => {
  const location = useRouterLocation();

  return {
    ...location,
    state: location.state as TState | undefined,
  };
};
