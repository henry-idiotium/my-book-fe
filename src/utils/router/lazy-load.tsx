/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, lazy, Suspense } from 'react';

import { LoadingScreen } from '@/components';

type ImportType<T> = () => Promise<{ default: ComponentType<T> }>;

const decoyProps: any = {};

export function lazyLoad<T>(fatory: ImportType<T>) {
  const LazyLoadedComponent = lazy(fatory);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <LazyLoadedComponent {...decoyProps} />
    </Suspense>
  );
}

export default lazyLoad;
