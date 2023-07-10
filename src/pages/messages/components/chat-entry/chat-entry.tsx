import UserImage from '@/assets/account-image.jpg';
import {
  useDeepCompareMemoize as deepCompareMemo,
  useMemoWithInitial,
  useSelector,
} from '@/hooks';
import { chatSocketSelectors, selectAuth } from '@/stores';
import { Convo, classnames, formatTimeReadable } from '@/utils';

import { ConversationResponse } from '../../types';

import styles from './chat-entry.module.scss';

export type ChatEntryProps = {
  entry: ConversationResponse;
  isActive?: boolean;
  openConvo?: () => void;
};

export function ChatEntry(props: ChatEntryProps) {
  const { entry, isActive, openConvo } = props;

  const { user: mainUser } = useSelector(selectAuth);
  const chatSocketState = useSelector(chatSocketSelectors.getById(entry.id));

  const latestMessage = useMemoWithInitial(
    () => {
      if (!chatSocketState) return;
      return chatSocketState.messages.at(-1);
    },
    entry.latestMessage,
    deepCompareMemo(chatSocketState?.messages),
  );

  const filteredParticipants = useMemoWithInitial(
    () => {
      if (!chatSocketState) return [];
      return chatSocketState.participants.filter((p) => p.id !== mainUser.id);
    },
    entry.participants,
    [chatSocketState?.participants.length],
  );

  const name = useMemoWithInitial(
    () => {
      if (!chatSocketState) return;
      const { isGroup, activeUserIds, ...conversation } = chatSocketState;
      return Convo.getName(conversation);
    },
    filteredParticipants
      ? Convo.getName({ ...entry, participants: filteredParticipants })
      : undefined,
    [chatSocketState?.name, filteredParticipants],
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
              <span>{name}</span>
            </div>

            {filteredParticipants[0] ? (
              <div className={styles.infoId}>
                <span>@{filteredParticipants[0].alias}</span>
              </div>
            ) : null}

            {latestMessage ? (
              <>
                <span className={styles.infoSep}>·</span>
                <div className={styles.infoTimeLastMessage}>
                  <span>{formatTimeReadable(latestMessage.at)}</span>
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
