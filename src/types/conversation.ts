import { z } from 'zod';

import { messageZod } from './message';
import { minimalUserZod } from './user';

import { getZodDefault } from '@/utils';

export const conversationZod = z.object({
  id: z.string(),
  theme: z.string().optional(),
  quickEmoji: z.string().optional(),
  conversationBetween: z.array(minimalUserZod),
  messages: z.array(messageZod).optional(),
});

export const defaultConversation = getZodDefault(conversationZod);
export type ConversationEntity = z.infer<typeof conversationZod>;
