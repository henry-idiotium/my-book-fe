import { ConversationEntity, MinimalUserEntity } from '@/types';

export type Connect = ActiveUserPayload & { conversation: ConversationEntity };
export type JoinChat = WithKeys<'id'>;
export type LeaveChat = WithKeys<'id'>;

// helpers
type WithKeys<T extends keyof MinimalUserEntity> = Pick<MinimalUserEntity, T>;
type ActiveUserPayload = { activeUserIds: number[] };
