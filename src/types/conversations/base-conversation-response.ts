import { z } from 'zod';

import { baseConversationZod } from './base-conversation';

export const baseConversationResponseZod = baseConversationZod.extend({
  totalMessageCount: z.number().optional(),
});
