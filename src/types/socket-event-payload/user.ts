import { ConversationEntity, ConversationGroupEntity } from '../chatbox';

export type Connected = {
  userCount: number;
  chatbox: ConversationEntity | ConversationGroupEntity;
};

export type Joined = {
  userCount: number;
  userJoinedId: number;
};

export type Disconnected = {
  id: number;
};
