import { z } from 'zod';

export type MessageEntity = z.infer<typeof messageZod>;
export const messageZod = z.object({
  id: z.string(),
  content: z.string().nullable(),
  from: z.number(),
  isEdited: z.boolean(),
  at: z.union([z.string(), z.number()]),
});
