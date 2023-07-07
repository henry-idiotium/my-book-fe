import { useParams } from 'react-router-dom';

import { useChatSocketConnection } from '../../hooks';

import Content from './content/content';
import styles from './conversation.module.scss';
import DirectMessages from './direct-messages/direct-messages';
import Header from './header/header';

import { useSelector } from '@/hooks';
import { selectAuth } from '@/stores';
import { ConversationEntity } from '@/types';

export function Conversation() {
  // const { id = '' } = useParams();

  // const { user: mainUser } = useSelector(selectAuth);

  // const { state: socketState, loading: socketLoading } =
  //   useChatSocketConnection(id);

  // if (socketLoading) return <div>loading...</div>;

  // const { isGroup, activeUserIds, ...socketConvo } = socketState;

  // const participants = Object.values(socketConvo.participants).filter(
  //   (pt) => pt.id !== mainUser.id
  // );
  // const conversation = { ...socketConvo, participants };

  // note: mock data
  const conversation: ConversationEntity = {
    id: '64a660a8c616995e4cfd82b1',
    participants: [
      {
        id: 55,
        alias: 'join_doe_46',
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        id: 54,
        alias: 'thor_karl',
        firstName: 'Thor Finn',
        lastName: 'Karl Sef Ni',
      },
    ],
    messages: [],
    messageSeenLog: [],
  };

  return (
    <div className={styles.container}>
      <Header conversation={conversation} />
      <Content conversation={conversation} />
      <DirectMessages conversation={conversation} />
    </div>
  );
}

export default Conversation;

// todo: chat socket redux state, merge convo and convoGroup then flat
//      them to the base props level

//#region utils
// todo: refactor, duplicate logic with chat entry

/* function getLatestMessage(messages?: MessageEntity[]) {
  if (!messages || !messages.length) return;

  const latestMsg = messages.reduce((former, latter) =>
    former.at > latter.at ? former : latter
  );

  return {
    ...latestMsg,
    at: formatTimeReadable(latestMsg.at),
  };
} */
//#endregion
