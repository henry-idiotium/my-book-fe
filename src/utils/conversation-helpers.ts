import { Conversation, ConversationGroupEntity } from '@/types';

export function isGroup(convo: Conversation): convo is ConversationGroupEntity {
  return 'admin' in convo && !!convo.admin;
}
