import { z } from 'zod';

// role
export type UserRoleEntity = z.infer<typeof userRoleZod>;
export const userRoleZod = z.object({
  id: z.number(),
  name: z.string(),
});

// status
export type UserStatusEntity = z.infer<typeof userStatusZod>;
export const userStatusZod = z.object({
  id: z.number(),
  name: z.string(),
});

// base user
const baseUserZod = z.object({
  id: z.number(),
  alias: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  socialId: z.union([z.number(), z.string()]).optional(),
  photo: z.string().nullable().optional(),
});

// full
export type UserEntity = z.infer<typeof userZod>;
export const userZod = baseUserZod.merge(
  z.object({
    email: z.string(),
    provider: z.string(),
    role: z.object(userRoleZod.shape),
    status: z.object(userStatusZod.shape),
  }),
);

// partial
export type MinimalUserEntity = z.infer<typeof minimalUserZod>;
export const minimalUserZod = baseUserZod.merge(
  z.object({
    metadata: z.record(z.any()).optional(),
  }),
);
