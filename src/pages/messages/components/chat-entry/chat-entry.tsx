import { useEffect, useState } from 'react';

import styles from './chat-entry.module.scss';

import UserImage from '@/assets/account-image.jpg';
import { useSelector } from '@/hooks';
import { selectAuth, selectChatSocketById } from '@/stores';
import { Conversation, MessageEntity, MinimalUserEntity } from '@/types';
import { Convo, User, formatTimeReadable } from '@/utils';

export type ChatEntryProps = {
  entry: Conversation;
  openConvo?: () => void;
};

export function ChatEntry(props: ChatEntryProps) {
  const { entry, openConvo } = props;

  const { user: mainUser } = useSelector(selectAuth);
  const chatSocketState = useSelector(selectChatSocketById(entry.id));

  const [latestMessage, setLatestMessage] = useState(
    getLatestMessage(entry.messages)
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
    <button className={styles.container} type="button" onClick={openConvo}>
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
function getEntryName(entry: Conversation, members?: MinimalUserEntity[]) {
  if (!Convo.isGroup(entry)) {
    const interculator = members?.at(0);
    return interculator ? User.getFullName(interculator) : '[interlocutor]';
  }
  return entry.name;
}

function filterMembers(entry: Conversation, mainUserId: number) {
  return (entry.admin ? entry.members : entry.conversationBetween)?.filter(
    (m) => m.id !== mainUserId
  );
}

function getLatestMessage(messages?: MessageEntity[]) {
  if (!messages || !messages.length) return;

  const latestMsg = messages.reduce((former, latter) =>
    former.at > latter.at ? former : latter
  );

  return {
    ...latestMsg,
    at: formatTimeReadable(latestMsg.at),
  };
}
