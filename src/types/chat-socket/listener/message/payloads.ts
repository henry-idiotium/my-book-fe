import { MessageEntity } from '@/types';

export type ReadReceipt = WithKeys<'id'>;
export type Receive = MessageEntity;
export type SendSuccess = MessageEntity;
export type UpdateSuccess = MessageEntity;
export type UpdateNotify = MessageEntity;
export type DeleteSuccess = WithKeys<'id'>;
export type DeleteNotify = WithKeys<'id'>;

// helpers
type WithKeys<T extends keyof MessageEntity> = Pick<MessageEntity, T>;
