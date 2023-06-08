import { z } from 'zod';

import { getZodDefault } from '@/utils';

// role
export const userRoleZod = z.object({
  id: z.number(),
  name: z.string(),
});
export const defaultUserRole = getZodDefault(userRoleZod);
export type UserRoleEntity = z.infer<typeof userRoleZod>;

//status
export const userStatusZod = z.object({
  id: z.number(),
  name: z.string(),
});
export const defaultUserStatus = getZodDefault(userStatusZod);
export type UserStatusEntity = z.infer<typeof userStatusZod>;

//user
export const userZod = z.object({
  id: z.number(),
  email: z.string(),
  provider: z.string(),
  socialId: z.union([z.number(), z.string()]).optional(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date(),
  photo: z.string(),
  role: z.object(userRoleZod.shape),
  status: z.object(userStatusZod.shape),
});
export const defaultUser = getZodDefault(userZod);
export type UserEntity = z.infer<typeof userZod>;

// minimal user
export type MinimalUserEntity = Partial<UserEntity> &
  Pick<UserEntity, 'id' | 'email' | 'firstName' | 'lastName' | 'socialId'>;
