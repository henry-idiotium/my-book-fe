import { Avatar } from '@material-tailwind/react';

import styles from './chat-entry.module.scss';

import { mock } from '@/api/mock';
import UserImage from '@/assets/account-image.jpg';
import {
  ConversationEntity,
  ConversationGroupEntity,
  MessageEntity,
  MinimalUserEntity,
} from '@/types';
import { formatTimeDistance } from '@/utils';

export type ChatEntryProps = {
  convo: PartialPick<ConversationEntity, 'conversationBetween'> &
    PartialPick<ConversationGroupEntity, 'admin' | 'name'>;
  onClick?: () => void;
};

export function ChatEntry({ convo, onClick }: ChatEntryProps) {
  // mock
  const mainUser = mock.getMainUser();
  const members = mock // other users, may include main user
    .getConvoMembers(2)
    .sort((m) => m.id)
    .filter(
      (m) =>
        convo.conversationBetween?.includes(m.id) ||
        convo.members?.includes(m.id)
    );

  const chatEntryInfo = getChatEntryInfo(convo, mainUser.id, members);
  const latestMessage = getLastestMessageInfo(convo.messages);

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
              <span>{chatEntryInfo?.name}</span>
            </div>

            {chatEntryInfo?.socialId ? (
              <div className={styles.infoId}>
                <span>{chatEntryInfo.socialId}</span>
              </div>
            ) : undefined}

            {latestMessage ? (
              <>
                <span>·</span>
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

function getChatEntryInfo(
  convo: ChatEntryProps['convo'],
  mainUserId: number,
  members?: MinimalUserEntity[]
) {
  if (!convo.admin) {
    const oppoMember = members?.find((m) => m.id !== mainUserId);

    if (!oppoMember) return undefined;

    return {
      id: convo.id,
      photo: oppoMember.photo,
      name: getUserFullname(oppoMember),
      socialId: getUserId(oppoMember),
    };
  }

  return {
    id: convo.id,
    photo: convo.photo,
    name: members?.map((m) => getUserFullname(m)).join(', '),
    socialId: undefined,
  };
}

function getLastestMessageInfo(messages?: MessageEntity[], showTime = false) {
  if (!messages) return undefined;

  const latestMsg = messages.reduce((former, latter) =>
    former.at > latter.at ? former : latter
  );

  return {
    ...latestMsg,
    at: formatTimeDistance(latestMsg.at, undefined, { timeRangeDefineNow: 5 }),
  };
}

function getUserFullname({ firstName, lastName }: Partial<MinimalUserEntity>) {
  return `${firstName} ${lastName}`;
}
function getUserId(user: Partial<MinimalUserEntity>) {
  return '@' + getUserFullname({ ...user }).replace(' ', '_');
}
