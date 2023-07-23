/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, lazy, Suspense } from 'react';

import { LoadingScreen } from '@/components';

type ImportType<T> = () => Promise<{ default: ComponentType<T> }>;

export function lazyLoad<T>(factory: ImportType<T>) {
  const LazyLoadedComponent = lazy(factory);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <LazyLoadedComponent />
    </Suspense>
  );
}

export default lazyLoad;
