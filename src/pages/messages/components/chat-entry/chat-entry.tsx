import { useEffect, useState } from 'react';

import UserImage from '@/assets/account-image.jpg';
import { useSelector } from '@/hooks';
import { selectAuth, chatSocketSelectors } from '@/stores';
import { ConversationEntity, MessageEntity, MinimalUserEntity } from '@/types';
import { Convo, User, classnames, formatTimeReadable } from '@/utils';

import styles from './chat-entry.module.scss';

export type ChatEntryProps = {
  entry: ConversationEntity;
  isActive?: boolean;
  openConvo?: () => void;
};

export function ChatEntry(props: ChatEntryProps) {
  const { entry, isActive, openConvo } = props;

  const { user: mainUser } = useSelector(selectAuth);
  const chatSocketState = useSelector(chatSocketSelectors.getById(entry.id));

  const [latestMessage, setLatestMessage] = useState(
    getLatestMessage(entry.messages),
  );

  // update to latest message on socket state change
  useEffect(() => {
    // for now only update the one that currently open
    if (!chatSocketState) return;

    const newlyGetLatestMessage = getLatestMessage(chatSocketState.messages);

    setLatestMessage(newlyGetLatestMessage);
  }, [chatSocketState?.messages]);

  const members = filterMembers(entry, mainUser.id);
  const entryName = getEntryName(entry, members);
  const oppositeTalker = members?.at(0);

  return (
    <button
      type="button"
      className={classnames(styles.container, { [styles.isActive]: isActive })}
      onClick={openConvo}
    >
      <div className={styles.wrapper}>
        <div className={styles.chatIcon}>
          <img src={UserImage} alt="chat profile" />
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

// todo: refactor, duplicate logic with conversation
function getEntryName(
  entry: ConversationEntity,
  members?: MinimalUserEntity[],
) {
  if (!Convo.isGroup(entry)) {
    const interlocutor = members?.at(0);
    return interlocutor ? User.getFullName(interlocutor) : '[interlocutor]';
  }
  return entry.name;
}

function filterMembers(entry: ConversationEntity, mainUserId: number) {
  return entry.participants?.filter((p) => p.id !== mainUserId);
}

function getLatestMessage(messages?: MessageEntity[]) {
  if (!messages || !messages.length) return;

  const latestMsg = messages.reduce((former, latter) =>
    former.at > latter.at ? former : latter,
  );

  return {
    ...latestMsg,
    at: formatTimeReadable(latestMsg.at),
  };
}
