import { ChatSocketListener, MessageSeenLog } from '@/types';

import { ChatSocketEntity } from '../../chat-socket-entity';
import { ConvoPayloadWrap, MessagePayload, WithMessageKeys as WithKeys } from '../helpers';

import Listener = ChatSocketListener.Message.Payloads;

export type Add = ConvoPayloadWrap<Listener.Receive>;
export type Update = ConvoPayloadWrap<WithKeys<'content' | 'id'>>;
export type FullUpdate = ConvoPayloadWrap<MessagePayload>;
export type Delete = ConvoPayloadWrap<Listener.DeleteNotify>;
export type UpdateSeenLog = ConvoPayloadWrap<MessageSeenLog>;
export type PrependMessages = ConvoPayloadWrap<{ messages: MessagePayload[] }>;

export type UpsertError = ConvoPayloadWrap<{
  payload: Partial<WithKeys<'id' | 'at'>>;
  reason?: string | null;
}>;

export type UpdateFetchingLog = ConvoPayloadWrap<ChatSocketEntity['meta']['message']['prevFetch']>;
