import { z } from 'zod';

import {
  conversationGroupZod,
  conversationZod,
  messageZod,
  minimalUserZod,
} from '@/types';
import { getZodDefault } from '@/utils';

export const chatboxSocketStateZod = z.object({
  convoId: z.string(),
  messages: z.array(messageZod),
  messagePending: z.string().nullable(),
  conversation: conversationZod,
  conversationGroup: conversationGroupZod,
  users: z.map(z.number(), minimalUserZod),
  userActiveCount: z.number(),
});
export type ChatboxSocketState = z.infer<typeof chatboxSocketStateZod>;
export const initialChatboxSocketState = getZodDefault(chatboxSocketStateZod);
