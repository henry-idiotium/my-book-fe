import { z, number, string, object, union, record, unknown } from 'zod';

export const userRoleZod = object({ id: number(), name: string() });
export const userStatusZod = object({ id: number(), name: string() });
const entityDateZod = union([string(), number()]).optional();

// base user
const baseUserZod = object({
  id: number(),
  alias: string(),
  firstName: string(),
  lastName: string(),
  socialId: union([number(), string()]).optional(),
  photo: string().nullable().optional(),
  createdAt: entityDateZod,
  updatedAt: entityDateZod,
  deletedAt: entityDateZod,
});

// full
export type UserEntity = z.infer<typeof userZod>;
export const userZod = baseUserZod.merge(
  object({
    email: string(),
    provider: string(),
    role: object(userRoleZod.shape),
    status: object(userStatusZod.shape),
  }),
);

// partial
export type MinimalUserEntity = z.infer<typeof minimalUserZod>;
export const minimalUserZod = baseUserZod.merge(
  object({
    metadata: record(unknown()).optional(),
  }),
);
