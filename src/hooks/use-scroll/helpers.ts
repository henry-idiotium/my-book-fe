import { getZodDefault } from '@/utils';

import { UseScrollOptions, VerticalOption, useScrollOptionsZod } from './types';

export function getDefaultOptions(options?: UseScrollOptions): UseScrollOptions {
  return { ...getZodDefault(useScrollOptionsZod), ...options };
}

export function getTop(element: HTMLDivElement, startAt: VerticalOption) {
  return startAt === 'bottom' ? element.scrollHeight : 0;
}
