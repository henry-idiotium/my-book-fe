import { z } from 'zod';

import {
  conversationGroupZod,
  conversationZod,
  messageZod,
  minimalUserZod,
} from '@/types';

export type ChatSocketEntity = z.infer<typeof chatSocketEntityZod>;
export const chatSocketEntityZod = z.object({
  convoId: z.string(), // note: conversation id
  messages: z.array(messageZod),
  messagePending: z.string().nullable(),
  conversation: conversationZod.optional(),
  conversationGroup: conversationGroupZod.optional(),
  users: z.record(z.number(), minimalUserZod).default({}),
  userActiveCount: z.number(),
});
