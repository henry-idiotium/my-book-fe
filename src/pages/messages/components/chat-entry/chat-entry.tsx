import { useState } from 'react';

import UserImage from '@/assets/account-image.jpg';
import { useSelector, useUpdateEffect } from '@/hooks';
import { chatSocketSelectors } from '@/stores';
import { initialMessage } from '@/types';
import { classnames, formatTimeReadable } from '@/utils';

import styles from './chat-entry.module.scss';
import { ChatEntryResponse } from './types';

export type ChatEntryProps = {
  entry: ChatEntryResponse;
  isActive?: boolean;
  openConvo?: () => void;
};

export function ChatEntry(props: ChatEntryProps) {
  const { entry, isActive, openConvo } = props;

  const chatSocketState = useSelector(chatSocketSelectors.getById(entry.id));

  const [latestMessage, setLatestMessage] = useState(entry.latestMessage);
  const [participants, setParticipants] = useState(entry.participants);

  useUpdateEffect(
    () => setLatestMessage(chatSocketState?.messages?.at(-1) ?? initialMessage),
    [chatSocketState?.messages?.at(-1)],
  );

  useUpdateEffect(
    () => setParticipants(Object.values(chatSocketState?.participants ?? {})),
    [chatSocketState?.participants],
  );

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
              <span>{entry.name}</span>
            </div>

            {participants[0] ? (
              <div className={styles.infoId}>
                <span>@{participants[0].alias}</span>
              </div>
            ) : null}

            {latestMessage ? (
              <>
                <span className={styles.infoSep}>·</span>
                <div className={styles.infoTimeLastMessage}>
                  <span>{formatTimeReadable(latestMessage.at, { type: 'minimal' })}</span>
                </div>
              </>
            ) : null}
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
