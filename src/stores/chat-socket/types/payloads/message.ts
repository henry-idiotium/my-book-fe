/* eslint-disable @typescript-eslint/no-namespace */
import { ChatSocketEmitter, ChatSocketListener, MessageEntity, MessageSeenLog } from '@/types';

import { ChatSocketEntity } from '../chat-socket-entity';

import { ConvoPayloadWrap, ConvoWrap } from './helpers';

import Emitter = ChatSocketEmitter.Message.Payloads;
import Listener = ChatSocketListener.Message.Payloads;

export type Add = ConvoPayloadWrap<Listener.Receive>;
export type Update = ConvoPayloadWrap<WithKeys<'content' | 'id'>>;
export type FullUpdate = ConvoPayloadWrap<Payload>;
export type Delete = ConvoPayloadWrap<Listener.DeleteNotify>;
export type UpdateSeenLog = ConvoPayloadWrap<MessageSeenLog>;
export type PrependMessages = ConvoPayloadWrap<{ messages: Payload[] }>;

export type UpsertError = ConvoPayloadWrap<{
  payload: Partial<WithKeys<'id' | 'at'>>;
  reason?: string | null;
}>;

export type UpdateFetchingLog = ConvoPayloadWrap<ChatSocketEntity['meta']['message']['prevFetch']>;

// socket event logic related types
export namespace Socket {
  export namespace Arg {
    export type Send = ConvoWrap<WithKeys<'content' | 'at'> & { userId: number }>;
    export type Update = ConvoWrap<WithKeys<'content' | 'id'>>;
    export type Delete = ConvoWrap<Emitter.Delete>;
    export type Seen = ConvoWrap<MessageSeenLog>;
    export type LoadHistory = ConvoWrap<Emitter.LoadHistory[0]>;
  }

  export namespace Result {
    export type Send = ConvoWrap<Payload>;
    export type LoadHistory = boolean;
  }
}

type Payload = RequiredNotNullPick<MessageEntity, 'content'>;
type WithKeys<T extends keyof Payload> = Pick<Payload, T>;
