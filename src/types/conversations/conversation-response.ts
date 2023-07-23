import { z } from 'zod';

import { baseConversationResponseZod } from './base-conversation-response';
import { groupConversationResponseZod } from './group';
import { pairedConversationResponseZod } from './pair';

export type ConversationResponse = z.infer<typeof conversationResponseZod>;
export const conversationResponseZod = z
  .object({})
  .merge(pairedConversationResponseZod)
  .merge(groupConversationResponseZod)
  .partial()
  .merge(baseConversationResponseZod);
