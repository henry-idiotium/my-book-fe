import UserImage from '@/assets/account-image.jpg';
import {
  useDeepCompareMemoize as deepCompareMemo,
  useInitialMemo,
  useSelector,
} from '@/hooks';
import { chatSocketSelectors, selectAuth } from '@/stores';
import { ChatSocketEntity } from '@/stores/chat-socket/types';
import { Convo, classnames, formatTimeReadable } from '@/utils';

import styles from './chat-entry.module.scss';
import { ChatEntryResponse } from './types';

export type ChatEntryProps = {
  entry: ChatEntryResponse;
  isActive?: boolean;
  openConvo?: () => void;
};

export function ChatEntry(props: ChatEntryProps) {
  const { entry, isActive, openConvo } = props;

  const { user: mainUser } = useSelector(selectAuth);
  const chatSocketState = useSelector(chatSocketSelectors.getById(entry.id));

  const latestMessage = useInitialMemo(
    () => chatSocketState?.messages.at(-1),
    entry.latestMessage,
    deepCompareMemo(chatSocketState?.messages),
  );

  const filteredParticipants = useInitialMemo<ChatSocketEntity['participants']>(
    () => {
      if (!chatSocketState) return [];
      return chatSocketState.participants.filter((p) => p.id !== mainUser.id);
    },
    entry.participants,
    [chatSocketState?.participants.length],
  );

  const name = useInitialMemo(
    () => {
      if (!chatSocketState) return;
      return Convo.getName({
        admin: chatSocketState.admin,
        participants: filteredParticipants,
      });
    },
    filteredParticipants.length
      ? Convo.getName({ ...entry, participants: filteredParticipants })
      : '[chat name]',
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
