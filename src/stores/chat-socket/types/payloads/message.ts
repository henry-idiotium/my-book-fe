import {
  ChatSocketEmitter,
  ChatSocketListener,
  MessageEntity,
  MessageSeenLog,
} from '@/types';

import { ConvoPayloadWrap, ConvoWrap } from './helpers';

import Emitter = ChatSocketEmitter.Message.Payloads;
import Listener = ChatSocketListener.Message.Payloads;

export type Add = ConvoPayloadWrap<Listener.Receive>;
export type Create = ConvoPayloadWrap<Emitter.Send>;
export type ResolvePending = Add;
export type Update = ConvoPayloadWrap<MessageEntity>;
export type Delete = ConvoPayloadWrap<Listener.DeleteNotify>;
export type UpdateSeenLog = ConvoPayloadWrap<MessageSeenLog>;

export type UpsertMessageError = ConvoPayloadWrap<{
  payload: Partial<WithKeys<'id' | 'at'>>;
  reason?: Nullable<string>;
}>;

// socket event logic related types
export type SocketSend = ConvoWrap<
  Omit<RequiredNotNull<Emitter.Send>, 'at'> & { userId: number }
>;
export type SocketUpdate = ConvoWrap<Emitter.Update>;
export type SocketDelete = ConvoWrap<Emitter.Delete>;
export type SocketSeen = ConvoWrap<MessageSeenLog>;

type WithKeys<T extends keyof MessageEntity> = Pick<MessageEntity, T>;
