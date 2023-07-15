import { z } from 'zod';

import { getZodDefault } from '../zod';

export type Options = z.infer<typeof optionsZod>;
export const optionsZod = z.object({
  dateStrFormat: z.string().optional(), // specify when input dates are not an ISO date string
  useYesterday: z.boolean().optional().default(true),
  simple: z.boolean().optional(),
});
export const initialOptions = getZodDefault(optionsZod);

export type DateArg = Date | string | number;
