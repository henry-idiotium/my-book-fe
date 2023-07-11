import { MessageEntity, MessageSeenLog } from '@/types';

export type ReadReceipt = MessageSeenLog;
export type Receive = MessageEntity;
export type UpdateNotify = MessageEntity;
export type DeleteNotify = WithKeys<'id'>;

export type SendSuccess = MessageEntity;
export type SendFailure = WithFailure<WithKeys<'at'>>;
export type UpdateFailure = WithFailure<WithKeys<'id'>>;
export type DeleteFailure = WithFailure<WithKeys<'id'>>;

// helpers
type WithKeys<T extends keyof MessageEntity> = Pick<MessageEntity, T>;
type WithFailure<T> = {
  payload: T;
  reason?: string;
};
