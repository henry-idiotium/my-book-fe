import { MessageEntity, MessageSeenLog } from '@/types';

export type ReadReceipt = MessageSeenLog;
export type Receive = Payload;
export type UpdateNotify = Payload;
export type DeleteNotify = WithKeys<'id'>;

// helpers
type Payload = RequiredNotNullPick<MessageEntity, 'content'>;
type WithKeys<T extends keyof Payload> = Pick<Payload, T>;
