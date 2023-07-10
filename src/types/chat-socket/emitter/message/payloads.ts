import { MessageEntity } from '@/types';

export type Send = WithKeys<'content' | 'at'>;
export type Update = WithKeys<'content' | 'id'>;
export type Delete = WithKeys<'id'>;
export type Seen = WithKeys<'id'>;

type WithKeys<T extends keyof MessageEntity> = Pick<MessageEntity, T>;
