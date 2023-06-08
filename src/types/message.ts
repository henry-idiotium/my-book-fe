import { z } from 'zod';

import { getZodDefault } from '@/utils';

export const messageZod = z.object({
  id: z.string(),
  content: z.string().nullable(),
  from: z.number(),
  isEdited: z.boolean(),
  at: z.date(),
});

export const defaultMessage = getZodDefault(messageZod);
export type MessageEntity = z.infer<typeof messageZod>;
