import { z } from 'zod';

export type MessageSeenLog = z.infer<typeof messageSeenLogZod>;
export const messageSeenLogZod = z.object({
  userId: z.number(),
  messageId: z.string(),
});
