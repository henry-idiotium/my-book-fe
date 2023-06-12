import { ConversationEntity, ConversationGroupEntity } from '.';

export type UserConnectedPayload = {
  userCount: number;
  chatbox: ConversationEntity | ConversationGroupEntity;
};

export type UserJoinedPayload = {
  userCount: number;
  userJoinedId: number;
};

export type UserDisconnectedPayload = {
  userDisconnectedId: number;
};

type MessageBase = { isGroup: boolean; chatboxId: string };

export type MessageSentPayload = {
  content: string;
} & MessageBase;

export type MessageUpdatingPayload = {
  id: string;
  content: string;
} & MessageBase;

export type MessageUpdatedPayload = {
  id: string;
  content: string;
};

export type MessageDeletingPayload = {
  id: string;
} & MessageBase;
