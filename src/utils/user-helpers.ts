import { truthy } from './filter-boolean';

import { MinimalUserEntity, UserEntity } from '@/types';

const sep = {
  USER: ' ',
  GROUP: ', ',
};

export function getAlias({ alias }: AllUserTypes) {
  return `@${alias}`;
}
export function getFullName({ firstName, lastName }: AllUserTypes) {
  return [firstName, lastName].filter(Boolean).join(sep.USER);
}

export function getDefaultGroupName(users: AllUserTypes[]) {
  return users
    .map((u) => getFullName(u))
    .filter(truthy)
    .join(sep.GROUP);
}

type AllUserTypes = PartialPick<UserEntity, UnrelatedKeys> | MinimalUserEntity;
type UnrelatedKeys = OuterJoin<keyof UserEntity, keyof MinimalUserEntity>;
type OuterJoin<Left extends string, Right extends string> = {
  [Key in Left]: Key extends Right ? never : Key;
}[Left];
