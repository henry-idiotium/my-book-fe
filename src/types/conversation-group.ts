import { z } from 'zod';

import { messageZod } from './message';

import { getZodDefault } from '@/utils';

export const conversationGroupZod = z.object({
  id: z.string(),
  name: z.string(),
  admin: z.number(),
  theme: z.string().optional(),
  quickEmoji: z.string().optional(),
  members: z.array(z.number()).optional(),
  messages: z.array(messageZod).optional(),
  photo: z.string().optional(),
});

export const defaultConversationGroup = getZodDefault(conversationGroupZod);
export type ConversationGroupEntity = z.infer<typeof conversationGroupZod>;
