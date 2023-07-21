import { z } from 'zod';

import { zodLiteralUnion } from '@/utils';

export type ScrollToArgs = [number, number] | [ScrollToOptions];
export type ScrollLocation = z.infer<typeof scrollLocationZod>;
export const scrollLocationZod = z.object({ x: z.number(), y: z.number() });

export type VerticalOption = z.infer<typeof verticalOptionZod>;
const verticalOptionZod = zodLiteralUnion('top', 'bottom');

export type UseScrollOptions = z.infer<typeof useScrollOptionsZod>;
export const useScrollOptionsZod = z
  .object({
    viewHeightPerc: z.number().default(1),
    startAt: verticalOptionZod.default('top'),
    behavior: z.custom<ScrollBehavior>().default('auto'),
    endAnchorHeight: z.number().default(30),
  })
  .partial();
