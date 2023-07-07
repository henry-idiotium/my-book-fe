import { useSelector } from 'react-redux';

// DEPRECATED: not really useful
export function createUseStore<TState>(key: string) {
  return function useStore<TSelected = TState>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    selector: (state: TState) => TSelected = (state) => state,
  ) {
    const store = useSelector((state: GenericObject) => state[key] as TState);
    return selector(store);
  };
}

export default createUseStore;
