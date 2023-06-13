import { z } from 'zod';

import {
  conversationGroupZod,
  conversationZod,
  messageZod,
  minimalUserZod,
} from '@/types';
import { getZodDefault } from '@/utils';

export const chatSocketEntityZod = z.object({
  convoId: z.string(), // note: conversation id
  messages: z.array(messageZod),
  messagePending: z.string().nullable(),
  conversation: conversationZod,
  conversationGroup: conversationGroupZod,
  users: z.record(z.number(), minimalUserZod).default({}),
  userActiveCount: z.number(),
});
export type ChatSocketEntity = z.infer<typeof chatSocketEntityZod>;
export const initialChatSocketEntity = getZodDefault(chatSocketEntityZod);
