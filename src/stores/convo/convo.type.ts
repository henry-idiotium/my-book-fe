import { ChatboxSocket } from '@/pages/messages/components/socket-context-provider/types';
import {
  ConversationEntity,
  ConversationGroupEntity,
  MessageEntity,
} from '@/types';

export interface UserConnected {
  userCount: number;
  chatbox: ConversationEntity | ConversationGroupEntity;
  socket: ChatboxSocket;
}

export interface UserDisconnected {
  userId: number;
  chatboxId: string;
}

export interface UserJoined {
  chatboxId: string;
  userCount: number;
  userJoinedId: number;
}

export interface MessageReceived extends MessageEntity {
  chatboxId: string;
}

export interface MessagePending {
  chatboxId: string;
  content: string;
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
