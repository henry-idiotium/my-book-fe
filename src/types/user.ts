import { z, date, number, object, string, union } from 'zod';

import { getZodDefault } from '@/utils';

// role
export const userRoleZod = object({
  id: number(),
  name: string(),
});
export const defaultUserRole = getZodDefault(userRoleZod);
export type UserRoleEntity = z.infer<typeof userRoleZod>;

//status
export const userStatusZod = object({
  id: number(),
  name: string(),
});
export const defaultUserStatus = getZodDefault(userStatusZod);
export type UserStatusEntity = z.infer<typeof userStatusZod>;

//user
export const userZod = object({
  id: number(),
  email: string(),
  provider: string(),
  socialId: union([number(), string()]).optional(),
  firstName: string(),
  lastName: string(),
  createdAt: date(),
  updatedAt: date(),
  deletedAt: date(),
  photo: string(),
  role: object(userRoleZod.shape),
  status: object(userStatusZod.shape),
});
export const defaultUser = getZodDefault(userZod);
export type UserEntity = z.infer<typeof userZod>;
