import { ConversationEntity, GroupConversation } from '@/types';

import { User } from '.';

type GenericConversation = Omit<ConversationEntity, 'participants'> & {
  participants: ConversationEntity['participants'];
};

export function isGroup(
  conversation?: Partial<GenericConversation>,
): conversation is GroupConversation {
  return !!conversation?.admin;
}

type GetNameArgs =
  | [RequiredPick<Partial<GenericConversation>, 'participants'>]
  | [isGroup: boolean, participants: GenericConversation['participants'], name?: string];
export function getName(...args: GetNameArgs) {
  const [isConvoGroup, participants, name] =
    typeof args[0] === 'object'
      ? ([isGroup(args[0]), args[0].participants, args[0].name] as const)
      : args;

  if (!isConvoGroup) {
    const interlocutor = participants.at(0);
    return interlocutor ? User.getFullName(interlocutor) : '[username]';
  }
  return name ?? User.getDefaultGroupName(participants);
}
