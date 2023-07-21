/* eslint-disable @typescript-eslint/no-namespace */
import { ChatSocketListener } from '@/types';

import { ChatSocketEntity } from '../chat-socket-entity';

import { ConvoPayloadWrap, ConvoWrap } from './helpers';

import Listener = ChatSocketListener.User.Payloads;

export type UpdateActiveUser = ConvoPayloadWrap<Listener.JoinChat>;

export namespace Socket {
  export namespace Arg {
    export type InitConversation = ConvoWrap<{ token: string }>;
    export type DisposeConnection = ConvoWrap;
  }
  export namespace Result {
    export type InitConversation = ChatSocketEntity;
    export type DisposeConnection = ConvoWrap;
  }
}
