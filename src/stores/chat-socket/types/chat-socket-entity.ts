import { z } from 'zod';

import { conversationResponseZod } from '@/types';

/** Redux store chat socket entity. */
export type ChatSocketEntity = z.infer<typeof chatSocketEntityZod>;
export const chatSocketEntityZod = conversationResponseZod.extend({
  isGroup: z.boolean(),
  activeUserIds: z.array(z.number()),

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
