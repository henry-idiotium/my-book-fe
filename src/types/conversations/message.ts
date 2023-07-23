import { z } from 'zod';

import { getZodDefault } from '@/utils';

export type MessageEntity = z.infer<typeof messageZod>;
export const messageZod = z.object({
  id: z.string(),
  content: z.string().nullable(),
  from: z.number(),
  isEdited: z.boolean(),
  at: z.union([z.string(), z.number()]),
});

export const initialMessage = getZodDefault(messageZod);
