import { z } from 'zod';

import { conversationResponseZod, minimalUserZod } from '@/types';
import { getZodDefault } from '@/utils';

/** Redux store chat socket entity. */
export type ChatSocketEntity = z.infer<typeof chatSocketEntityZod>;
export const chatSocketEntityZod = conversationResponseZod.extend({
  isGroup: z.boolean(),
  activeUserIds: z.array(z.number()),

  messageSeenLog: z.record(z.string()),
  participants: z.record(minimalUserZod),
  name: z.string(),

  meta: z.object({
    message: z.object({
      errors: z.record(
        z.object({
          reason: z.string().nullable().optional(),
        }),
      ),

      prevFetch: z.object({
        /** take amount */
        count: z.number(),
        /** take position */
        nthFromEnd: z.number(),
        /** result count */
        size: z.number(),
      }),
    }),
  }),
});

export const initialChatSocketEntity = getZodDefault(chatSocketEntityZod);
