import { ConversationEntity, GroupConversation } from '@/types';

import { User } from '.';

type ConvoArgs<T extends keyof ConversationEntity = never> = RequiredPick<
  Partial<ConversationEntity>,
  T
>;

export function isGroup(convo: ConvoArgs): convo is GroupConversation {
  return !!convo?.admin;
}

export function getName(convo: ConvoArgs<'participants'>) {
  if (!isGroup(convo)) {
    const interlocutor = convo.participants.at(0);
    return interlocutor ? User.getFullName(interlocutor) : '[username]';
  }
  return convo.name ?? User.getDefaultGroupName(convo.participants);
}
