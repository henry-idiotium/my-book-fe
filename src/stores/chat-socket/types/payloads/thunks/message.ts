import { ChatSocketEmitter, MessageSeenLog } from '@/types';

import { ConvoWrap, MessagePayload, WithMessageKeys as WithKeys } from '../helpers';

import Emitter = ChatSocketEmitter.Message.Payloads;

export type Send = {
  Arg: ConvoWrap<WithKeys<'content' | 'at'> & { userId: number }>;
  Returned: ConvoWrap<MessagePayload>;
};
export type Update = ConvoWrap<WithKeys<'content' | 'id'>>;
export type Delete = ConvoWrap<Emitter.Delete>;
export type Seen = ConvoWrap<MessageSeenLog>;
export type LoadHistory = ConvoWrap<Emitter.LoadHistory[0]>;
