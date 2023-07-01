import { ConversationEntity, MinimalUserEntity } from '@/types';

export type Connect = ActiveUserPayload & { conversation: ConversationEntity };
export type JoinChat = ActiveUsersWithKeys<'id'>;
export type LeaveChat = ActiveUsersWithKeys<'id'>;

// helpers
type WithKeys<T extends keyof MinimalUserEntity> = Pick<MinimalUserEntity, T>;
type ActiveUserPayload = { activeUserIds: number[] };
type ActiveUsersWithKeys<T extends keyof MinimalUserEntity> = WithKeys<T> &
  ActiveUserPayload;
