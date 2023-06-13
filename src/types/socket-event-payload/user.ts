import { ConversationEntity, ConversationGroupEntity } from '../chatbox';

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
