import { z } from 'zod';

import { getZodDefault } from '@/utils';

export const productZod = z.object({
  id: z.number(),
  name: z.string(),
});

export const defaultProduct = getZodDefault<typeof productZod>(productZod);
export type ProductEntity = z.infer<typeof productZod>;
