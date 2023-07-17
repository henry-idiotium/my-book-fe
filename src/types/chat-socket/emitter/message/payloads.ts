import { MessageEntity } from '@/types';

export type Send = WithKeys<'content' | 'at'>;
export type Update = WithKeys<'content' | 'id'>;
export type Delete = WithKeys<'id'>;
export type Seen = WithKeys<'id'>;

export type CountTotal = [request: void, response: (total: number) => void];
export type LoadHistory = [
  request: { count: number; nthFromEnd?: number },
  response: (args: MessageEntity[]) => void,
];

type WithKeys<T extends keyof MessageEntity> = Pick<MessageEntity, T>;
