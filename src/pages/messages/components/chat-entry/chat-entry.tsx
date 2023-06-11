import { Avatar } from '@material-tailwind/react';

import styles from './chat-entry.module.scss';

import UserImage from '@/assets/account-image.jpg';
import { useSelector } from '@/hooks';
import { selectAuth } from '@/stores';
import {
  ConversationEntity,
  ConversationGroupEntity,
  MessageEntity,
  MinimalUserEntity,
} from '@/types';
import { extractUserName, formatTimeReadable } from '@/utils';

export type ChatboxEntry = PartialPick<
  ConversationEntity,
  'conversationBetween'
> &
  PartialPick<ConversationGroupEntity, 'admin' | 'name'>;

export type ChatEntryProps = {
  entry: ChatboxEntry;
  onClick?: () => void;
};

export function ChatEntry({ entry, onClick }: ChatEntryProps) {
  const { user: mainUser } = useSelector(selectAuth);

  const members = filterMembers(entry, mainUser.id);
  const entryName = getEntryName(entry, members);
  const latestMessage = getLastestMessage(entry.messages);
  const oppositeTalker = members?.at(0);

  return (
    <button className={styles.container} type="button" onClick={onClick}>
      <div className={styles.wrapper}>
        <div className={styles.chatIcon}>
          <Avatar
            className={styles.chatIconImg}
            variant="circular"
            src={UserImage}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.infoName}>
              <span>{entryName}</span>
            </div>

            {oppositeTalker ? (
              <div className={styles.infoId}>
                <span>@{oppositeTalker.alias}</span>
              </div>
            ) : undefined}

            {latestMessage ? (
              <>
                <span className={styles.infoSep}>·</span>
                <div className={styles.infoTimeLastMessage}>
                  <span>{latestMessage.at}</span>
                </div>
              </>
            ) : undefined}
          </div>

          <div className={styles.lastMessage}>
            <span>{latestMessage?.content}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default ChatEntry;

function getEntryName(entry: ChatboxEntry, members?: MinimalUserEntity[]) {
  return !entry.admin
    ? extractUserName(members?.at(0))
    : members?.map((m) => extractUserName(m)).join(', ') ?? '';
}

function filterMembers(entry: ChatboxEntry, mainUserId: number) {
  return (entry.admin ? entry.members : entry.conversationBetween)?.filter(
    (m) => m.id !== mainUserId
  );
}

function getLastestMessage(messages?: MessageEntity[], showTime = false) {
  if (!messages) {
    return {
      id: '68f1fc63-3151-5ac0-8aed-7fe8c709ef20',
      at: formatTimeReadable(new Date('2023-06-09T07:25:05')),
      content: 'Voluptatem vel consequatur facere rerum quidem et consequatur.',
      from: 11,
      isEdited: false,
    };
  }

  const latestMsg = messages.reduce((former, latter) =>
    former.at > latter.at ? former : latter
  );

  return {
    ...latestMsg,
    at: formatTimeReadable(latestMsg.at),
  };
}
