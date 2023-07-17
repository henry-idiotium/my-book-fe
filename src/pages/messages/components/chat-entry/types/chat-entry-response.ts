import {
  ConversationEntity,
  GroupConversation,
  MessageEntity,
  PairedConversation,
} from '@/types';

export type ChatEntryResponse = BaseWrap<ConversationEntity>;
export type GroupChatEntryResponse = BaseWrap<GroupConversation>;
export type PairedChatEntryResponse = BaseWrap<PairedConversation>;

type BaseWrap<T extends { messages: unknown }> = Omit<
  T & { latestMessage: MessageEntity },
  'messages'
>;
