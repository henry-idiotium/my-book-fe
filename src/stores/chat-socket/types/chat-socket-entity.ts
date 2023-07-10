import { z } from 'zod';

import { conversationEntityZod } from '@/types';

/**
 * Redux store chat socket entity.
 */
export type ChatSocketEntity = z.infer<typeof chatSocketEntityZod>;
export const chatSocketEntityZod = conversationEntityZod.extend({
  isGroup: z.boolean(),
  activeUserIds: z.number().array(),
});