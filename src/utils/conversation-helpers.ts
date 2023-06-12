import { ChatboxEntry } from '@/pages/messages/components';
import { ConversationGroupEntity } from '@/types';

export function isGroup(
  chatbox: ChatboxEntry
): chatbox is ConversationGroupEntity {
  return 'admin' in chatbox;
}
