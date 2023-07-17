import { z } from 'zod';

import { conversationResponseZod } from '@/types';

/** Redux store chat socket entity. */
export type ChatSocketEntity = z.infer<typeof chatSocketEntityZod>;
export const chatSocketEntityZod = conversationResponseZod.extend({
  isGroup: z.boolean(),
  activeUserIds: z.array(z.number()),
  errorMessages: z.record(
    z.object({
      reason: z.string().nullable().optional(),
    }),
  ),
});
