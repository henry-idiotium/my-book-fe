import { ChatSocketEmitter } from '@/types';

import { ConvoWrap } from './helpers';

import Emitter = ChatSocketEmitter.Message.Payloads;

export type Send = ConvoWrap<Emitter.Send>;
export type Update = ConvoWrap<Emitter.Update>;
export type Delete = ConvoWrap<Emitter.Delete>;
export type Seen = ConvoWrap<Emitter.Seen & { userId: number }>;
