import {
  ChatboxSocket,
  ConversationEntity,
  ConversationGroupEntity,
  MessageEntity,
} from '@/types';

export interface UserConnected {
  userActiveCount: number;
  chatbox: ConversationEntity | ConversationGroupEntity;
  socket: ChatboxSocket;
}

export interface UserDisconnected {
  userId: number;
  chatboxId: string;
}

export interface UserJoined {
  chatboxId: string;
  userActiveCount: number;
  userJoinedId: number;
}

export interface MessageReceived extends MessageEntity {
  chatboxId: string;
}

export interface MessagePending {
  chatboxId: string;
  content: string | null;
}

export interface MessageDeleted {
  chatboxId: string;
  id: string;
}

export interface MessageUpdated {
  chatboxId: string;
  id: string;
  content: string;
}
