import { ConversationEntity } from './conversation';
import { ConversationGroupEntity } from './conversation-group';
import { MessageEntity } from './message';

export type UserConnectedPayload = {
  userCount: number;
  userIds: number[];
  chatbox: ConversationEntity | ConversationGroupEntity;
};

export type UserJoinedPayload = {
  userCount: number;
  userJoinedId: number;
};

export type UserDisconnectedPayload = {
  userCount: number;
  userDisconnectedId: number;
};

export type MessageSentPayload = {
  chatboxId: string;
  userId: number;
  content: string;
  isGroup: boolean;
};

export type MessageReceivedPayload = MessageEntity;
