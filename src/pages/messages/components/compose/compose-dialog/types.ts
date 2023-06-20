import { z } from 'zod';

export type GroupCreatedResponse = z.infer<typeof groupCreatedResponseZod>;
export const groupCreatedResponseZod = z.object({
  id: z.string(),
  name: z.string(),
  admin: z.number(),
  photo: z.string().optional(),
  successMemberIds: z.array(z.number()).optional(),
  failedMemberIds: z.array(z.number()).optional(),
});

export type CreateGroupChat = z.infer<typeof createGroupChatZod>;
export const createGroupChatZod = z.object({
  name: z.string().optional(),
  photo: z.string().optional(),
  memberIds: z.array(z.number()).optional(),
});
