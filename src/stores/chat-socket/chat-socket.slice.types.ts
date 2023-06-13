/* eslint-disable @typescript-eslint/no-namespace */
import { PayloadAction } from '@reduxjs/toolkit';

import {
  MessageEntity,
  ChatSocket,
  ConversationEntity,
  ConversationGroupEntity,
} from '@/types';

type PayloadWrap<T> = PayloadAction<T>;
type PayloadWrapWithId<T> = PayloadWrap<T & { convoId: string }>;

export namespace ChatSocketActionPayload {
  export namespace User {
    export type Joined = PayloadWrapWithId<{
      userActiveCount: number;
      userJoinedId: number;
    }>;

    export type Connected = PayloadWrap<{
      userActiveCount: number;
      chatbox: ConversationEntity | ConversationGroupEntity;
    }>;

    export type Disconnected = PayloadWrapWithId<{
      userId: number;
    }>;
  }

  export namespace Message {
    export type Received = PayloadWrapWithId<MessageEntity>;

    export type Pending = PayloadWrapWithId<{
      content: string | null;
    }>;

    export type Deleted = PayloadWrapWithId<{
      id: string;
    }>;

    export type Updated = PayloadWrapWithId<{
      id: string;
      content: string;
    }>;
  }
}
export default ChatSocketActionPayload;
