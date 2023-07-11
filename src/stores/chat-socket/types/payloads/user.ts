import { ChatSocketListener } from '@/types';

import { ConvoPayloadWrap, ConvoWrap } from './helpers';

import Listener = ChatSocketListener.User.Payloads;

export type InitConversation = ConvoWrap<{ token: string }>;
export type DisposeConnection = ConvoWrap;

export type UpdateActiveUser = ConvoPayloadWrap<
  Listener.JoinChat & { type?: 'add' | 'remove' }
>;
