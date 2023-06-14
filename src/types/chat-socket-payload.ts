/* eslint-disable @typescript-eslint/no-namespace */
import { ConversationEntity, ConversationGroupEntity } from './conversations';
import { MessageEntity } from './message';

export namespace ChatSocketPayload {
  export namespace User {
    export type Connected = {
      userActiveCount: number;
      chatbox: ConversationEntity | ConversationGroupEntity;
    };

    export type Joined = {
      userActiveCount: number;
      userJoinedId: number;
    };

    export type Disconnected = {
      id: number;
    };
  }

  export namespace Message {
    type With<T extends keyof Payload> = Pick<Payload, T>;
    type Payload = {
      id: string;
      content: string;
      isGroup: boolean;
      chatboxId: string;
    };

    export type Received = MessageEntity;

    export type Sent = With<'content' | 'isGroup' | 'chatboxId'>;
    export type Updating = With<'id' | 'content' | 'isGroup' | 'chatboxId'>;
    export type Updated = With<'id' | 'content'>;
    export type Deleting = With<'id' | 'isGroup' | 'chatboxId'>;
    export type Deleted = With<'id'>;
  }
}
export default ChatSocketPayload;
