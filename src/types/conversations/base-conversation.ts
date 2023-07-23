import { array, object, string, z } from 'zod';

import { minimalUserZod } from '../user';

import { messageZod } from './message';
import { messageSeenLogZod } from './message-seen-log';

export type BaseConversation = z.infer<typeof baseConversationZod>;
export const baseConversationZod = object({
  id: string(),
  participants: array(minimalUserZod),
  messages: array(messageZod),
  messageSeenLog: array(messageSeenLogZod),
  theme: string().optional(),
  quickEmoji: string().optional(),
});
