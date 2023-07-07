import { ConversationEntity, GroupConversation } from '@/types';

export function isGroup(
  convo: Partial<ConversationEntity>,
): convo is GroupConversation {
  return !!convo?.admin;
}
