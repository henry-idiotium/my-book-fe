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
  const members = mock // other users
    .getConvoMembers(2)
    .sort((m) => m.id)
    .filter(
      (m) =>
        convo.conversationBetween?.includes(m.id) ||
        convo.members?.includes(m.id)
    );

  const convoInfo = getConvoInfo(convo, mainUser.id, members);
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
            <div className={styles.userName}>
              <span>{convoInfo?.name}</span>
            </div>

            {convoInfo?.socialId ? (
              <div className={styles.userId}>
                <span>{convoInfo.socialId}</span>
              </div>
            ) : undefined}

            {latestMessage ? (
              <>
                <span className={styles.sep}>·</span>
                <div className={styles.timeLastMessage}>
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

function getConvoInfo(
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
    at: formatTimeDistance(latestMsg.at),
  };
}

function getUserFullname({ firstName, lastName }: Partial<MinimalUserEntity>) {
  return `${firstName} ${lastName}`;
}
function getUserId(user: Partial<MinimalUserEntity>) {
  return '@' + getUserFullname({ ...user }).replace(' ', '_');
}
