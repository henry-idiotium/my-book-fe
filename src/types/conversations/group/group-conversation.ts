import { z } from 'zod';

import { baseConversationZod } from '../base-conversation';

/** Conversation between more than two individuals.  */
export type GroupConversation = z.infer<typeof groupConversationZod>;
export const groupConversationZod = baseConversationZod.extend({
  admin: z.number(),
  name: z.string().optional(),
  photo: z.string().optional(),
});
