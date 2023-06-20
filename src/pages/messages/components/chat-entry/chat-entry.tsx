import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './chat-entry.module.scss';

import UserImage from '@/assets/account-image.jpg';
import { useSelector } from '@/hooks';
import { selectAuth, selectChatSocketById } from '@/stores';
import {
  ConversationEntity,
  ConversationGroupEntity,
  MessageEntity,
  MinimalUserEntity,
} from '@/types';
import { User, formatTimeReadable } from '@/utils';

export type ChatboxEntry = PartialPick<
  ConversationEntity,
  'conversationBetween'
> &
  PartialPick<ConversationGroupEntity, 'admin' | 'name'>;

export type ChatEntryProps = {
  entry: ChatboxEntry;
  handleOpenConversation?: () => void;
};

export function ChatEntry(props: ChatEntryProps) {
  const { entry, handleOpenConversation } = props;

  const param = useParams();

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
  }, [param, chatSocketState?.messages]);

  const members = filterMembers(entry, mainUser.id);
  const entryName = getEntryName(entry, members);
  const oppositeTalker = members?.at(0);

  return (
    <button
      className={styles.container}
      type="button"
      onClick={handleOpenConversation}
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

function getEntryName(entry: ChatboxEntry, members?: MinimalUserEntity[]) {
  return !entry.admin
    ? User.extractFullName(members?.at(0))
    : members?.map((m) => User.extractFullName(m)).join(', ') ?? '';
}

function filterMembers(entry: ChatboxEntry, mainUserId: number) {
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
