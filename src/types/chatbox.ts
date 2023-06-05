import { z } from 'zod';

import { messageZod } from './message';

import { getZodDefault } from '@/utils';

export const chatboxZod = z.object({
  id: z.string(),
  name: z.string(),
  admin: z.number(),
  theme: z.string().optional(),
  quickEmoji: z.string().optional(),
  members: z.array(z.number()).optional(),
  messages: z.array(messageZod).optional(),
});

export const defaultChatbox = getZodDefault<typeof chatboxZod>(chatboxZod);
export type ChatboxEntity = z.infer<typeof chatboxZod>;
