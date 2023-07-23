import { ChatSocketEntity, initialChatSocketEntity } from '@/stores/chat-socket/types';
import { ConversationEntity } from '@/types';
import { Convo } from '@/utils';

import * as Constants from '../constants';

export function computeToChatSocketState(
  conversation: ConversationEntity,
  activeUserIds: number[],
  sessionUserId: number,
): ChatSocketEntity {
  const participants = conversation.participants.filter((pt) => pt.id !== sessionUserId);
  const participantsRecord = Object.fromEntries(participants.map((pt) => [pt.id, pt]));

  const messageSeenLogRecord = Object.fromEntries(
    conversation.messageSeenLog.map((log) => [log.userId, log.messageId]),
  );

  const name = Convo.getName({ ...conversation, participants });
  const isGroup = Convo.isGroup(conversation);

  const chatSocketState: ChatSocketEntity = {
    ...initialChatSocketEntity,
    ...conversation,
    messageSeenLog: messageSeenLogRecord,
    participants: participantsRecord,
    activeUserIds,
    isGroup,
    name,
  };

  chatSocketState.meta.message.prevFetch = {
    count: Constants.LATEST_MESSAGES_COUNT,
    size: conversation.messages.length,
    nthFromEnd: 0,
  };

  return chatSocketState;
}
