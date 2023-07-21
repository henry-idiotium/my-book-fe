import { MessageEntity, MessageSeenLog } from '@/types';

export type ReadReceipt = MessageSeenLog;
export type Receive = Payload;
export type UpdateNotify = Payload;
export type DeleteNotify = WithKeys<'id'>;

/** @deprecated replaced by exception  */
export type SendFailure = WithFailure<WithKeys<'at'>>;
/** @deprecated replaced by exception  */
export type UpdateFailure = WithFailure<WithKeys<'id'>>;
/** @deprecated replaced by exception  */
export type DeleteFailure = WithFailure<WithKeys<'id'>>;

// helpers
type Payload = RequiredNotNullPick<MessageEntity, 'content'>;
type WithKeys<T extends keyof Payload> = Pick<Payload, T>;
type WithFailure<T> = {
  payload: T;
  reason?: string;
};
