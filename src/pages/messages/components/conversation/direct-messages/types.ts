import { z } from 'zod';

import { MAX_MESSAGE_LENGTH } from './constants';

export type MessageForm = z.infer<typeof messageFormZod>;
export const messageFormZod = z.object({
  message: z.string().max(MAX_MESSAGE_LENGTH),
});
