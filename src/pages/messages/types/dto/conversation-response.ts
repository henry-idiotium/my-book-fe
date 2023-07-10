/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

import {
  conversationEntityZod,
  groupConversationZod,
  messageZod,
} from '@/types';

const wrap = <T extends { messages: any }>(schema: z.ZodObject<T>) => {
  return schema.extend({ latestMessage: messageZod }).omit({ messages: true });
};

export type ConversationResponse = z.infer<typeof conversationResponseZod>;
export const conversationResponseZod = wrap(conversationEntityZod);

export type GroupConversationResponse = z.infer<
  typeof groupConversationResponseZod
>;
export const groupConversationResponseZod = wrap(groupConversationZod);

export type PairedConversationResponse = z.infer<
  typeof pairedConversationResponseZod
>;
export const pairedConversationResponseZod = wrap(groupConversationZod);
