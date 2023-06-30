import { z } from 'zod';

import { conversationEntityZod, minimalUserZod } from '@/types';

/**
 * Redux store chat socket entity.
 */
export type ChatSocketEntity = z.infer<typeof chatSocketEntityZod>;
export const chatSocketEntityZod = conversationEntityZod.extend({
  isGroup: z.boolean(),
  participants: z.record(z.number(), minimalUserZod),
  activeUserIds: z.number().array(),
});
