import { MinimalUserEntity, UserEntity } from '@/types';

export function extractFullName(
  user?: Partial<UserEntity | MinimalUserEntity>
) {
  return user ? `${user.firstName} ${user.lastName}` : '';
}
