import { z } from 'zod';

import { messageZod } from './message';
import { minimalUserZod } from './user';

// base
const convoZod = z.object({
  id: z.string(),
  theme: z.string().optional(),
  quickEmoji: z.string().optional(),
  messages: z.array(messageZod).optional(),
});

// pair conversation
export type ConversationEntity = z.infer<typeof conversationZod>;
export const conversationZod = convoZod.merge(
  z.object({ conversationBetween: z.array(minimalUserZod) })
);

// group conversation
export type ConversationGroupEntity = z.infer<typeof conversationGroupZod>;
export const conversationGroupZod = convoZod.merge(
  z.object({
    name: z.string().optional(),
    admin: z.number(),
    members: z.array(minimalUserZod).optional(),
    photo: z.string().optional(),
  })
);
