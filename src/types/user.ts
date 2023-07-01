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
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  socialId: z.union([z.number(), z.string()]).optional(),
  photo: z.string().optional(),
});

// full
export type UserEntity = z.infer<typeof userZod>;
export const userZod = baseUserZod.merge(
  z.object({
    provider: z.string(),
    role: z.object(userRoleZod.shape),
    status: z.object(userStatusZod.shape),

    // remarks: non-serializable, consider remove this logic
    // createdAt: z.date(),
    // updatedAt: z.date(),
    // deletedAt: z.date(),
  })
);

// partial
export type MinimalUserEntity = z.infer<typeof minimalUserZod>;
export const minimalUserZod = baseUserZod.merge(
  z.object({
    metadata: z.record(z.any()).optional(),
  })
);
