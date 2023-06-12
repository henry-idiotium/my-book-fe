import { z } from 'zod';

import { messageZod } from './message';
import { minimalUserZod } from './user';

import { getZodDefault } from '@/utils';

// base
const convoZod = z.object({
  id: z.string(),
  theme: z.string().optional(),
  quickEmoji: z.string().optional(),
  messages: z.array(messageZod).optional(),
});

// pair chat
export const conversationZod = convoZod.merge(
  z.object({ conversationBetween: z.array(minimalUserZod) })
);
export const defaultConversation = getZodDefault(conversationZod);
export type ConversationEntity = z.infer<typeof conversationZod>;

// group chat
export const conversationGroupZod = convoZod.merge(
  z.object({
    name: z.string(),
    admin: z.number(),
    members: z.array(minimalUserZod).optional(),
    photo: z.string().optional(),
  })
);
export const defaultConversationGroup = getZodDefault(conversationGroupZod);
export type ConversationGroupEntity = z.infer<typeof conversationGroupZod>;
