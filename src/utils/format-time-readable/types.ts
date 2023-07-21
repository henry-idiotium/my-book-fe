import { z } from 'zod';

import { getZodDefault, zodLiteralUnion } from '../zod';

export type FormatTimeReadableOptions = z.infer<typeof optionsZod>;
const optionsZod = z.object({
  /** Should specify when input dates are not an ISO date string. */
  dateStrFormat: z.string().optional(),

  /** default: new Date() */
  end: z.union([z.string(), z.number(), z.date()]).default(new Date()).optional(),

  /** Format type, default: full */
  type: zodLiteralUnion('minimal', 'full', 'no times').default('full').optional(),

  /** e.g., `Yesterday, 13:31 PM` -> `13:31 PM` */
  disableYesterdayAnnotation: z.boolean().optional(),
});

export const initialOptions = getZodDefault(optionsZod);

export type RawDate = Date | string | number;

export type FormatTimeReadableArgs = [start: RawDate, options?: FormatTimeReadableOptions];
