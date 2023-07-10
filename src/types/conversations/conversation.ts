import { z } from 'zod';

import { baseConversationZod } from './base-conversation';
import { groupConversationZod } from './group-conversation';
import { pairedConversationZod } from './paired-conversation';

/** Conversation base type, where it except both types of conversation.  */
export type ConversationEntity = z.infer<typeof conversationEntityZod>;
export const conversationEntityZod = z
  .object({})
  .extend(pairedConversationZod.shape)
  .extend(groupConversationZod.shape)
  .deepPartial()
  .extend(baseConversationZod.shape);

/**
 * Strict version of the base {@link ConversationEntity} type,
 * where it ONLY except paired OR group conversation.
 * @see {@link ConversationEntity} type except both
 */
export type ConversationStrict = z.infer<typeof conversationStrictZod>;
export const conversationStrictZod = z.discriminatedUnion('isGroup', [
  pairedConversationZod.extend({ isGroup: z.literal(false) }),
  groupConversationZod.extend({ isGroup: z.literal(true) }),
]);
