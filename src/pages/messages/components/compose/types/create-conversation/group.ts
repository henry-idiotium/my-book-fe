import { z } from 'zod';

export type Response = z.infer<typeof responseZod>;
export const responseZod = z.object({
  id: z.string(),
  admin: z.number(),
  name: z.string().optional(),
  photo: z.string().optional(),
  successMemberIds: z.array(z.number()).optional(),
  failedMemberIds: z.array(z.number()).optional(),
});

export type Request = z.infer<typeof requestZod>;
export const requestZod = z
  .object({
    name: z.string(),
    photo: z.string(),
    participants: z.array(z.number()),
  })
  .deepPartial();
