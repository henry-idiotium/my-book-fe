import { MessageEntity } from '@/types';
import { Acknowledgment } from '@/types/socket-helper';

export type Send = Acknowledgment<WithKeys<'content' | 'at'>, Payload>;
export type Update = WithKeys<'content' | 'id'>;
export type Delete = WithKeys<'id'>;
export type Seen = WithKeys<'id'>;

export type LoadHistory = Acknowledgment<{ count: number; nthFromEnd: number }, Payload[]>;

type Payload = RequiredNotNullPick<MessageEntity, 'content'>;
type WithKeys<T extends keyof Payload> = Pick<Payload, T>;
