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

// pair
export type ConversationEntity = z.infer<typeof conversationZod>;
export const conversationZod = convoZod.merge(
  z.object({ conversationBetween: z.array(minimalUserZod) })
);

// group
export type ConversationGroupEntity = z.infer<typeof conversationGroupZod>;
export const conversationGroupZod = convoZod.merge(
  z.object({
    name: z.string(),
    admin: z.number(),
    members: z.array(minimalUserZod).optional(),
    photo: z.string().optional(),
  })
);

/**
 * An union bettwen pair and group chat; or conversation
 * and conversation group.
 */
export type Conversation = RequiredPick<
  Partial<ConversationEntity & ConversationGroupEntity>,
  'id'
>;
