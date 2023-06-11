import { MinimalUserEntity, UserEntity } from '@/types';

export function extractUserName(
  user?: Partial<UserEntity | MinimalUserEntity>
) {
  return user ? `${user.firstName} ${user.lastName}` : '';
}
