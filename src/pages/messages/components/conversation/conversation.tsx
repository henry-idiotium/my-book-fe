import { useParams } from 'react-router-dom';

import { useChatSocketConnection } from '../../hooks';

import Content from './content/content';
import styles from './conversation.module.scss';
import Header from './header/header';

import { useSelector } from '@/hooks';
import { selectAuth } from '@/stores';

export function Conversation() {
  const { id = '' } = useParams();

  const { user: mainUser } = useSelector(selectAuth);

  const { state: socketState, loading: socketLoading } =
    useChatSocketConnection(id);

  if (socketLoading) return <div>loading...</div>;

  const { isGroup, activeUserIds, ...socketConvo } = socketState;

  const participants = Object.values(socketConvo.participants).filter(
    (pt) => pt.id !== mainUser.id
  );

  return (
    <div className={styles.container}>
      <Header conversation={{ ...socketConvo, participants }} />

      <Content conversation={{ ...socketConvo, participants }} />

      <div className={styles.compose}>
        {/*
        // todo: take a lock into "Wysiwyg Editor", for typing message
        compose editor
        add picture
        add gif
        emoji
      */}
      </div>
    </div>
  );

  /*
  return (
    <div className={styles.container}>
      * all users
      <div className="border-sky-500 border p-4">
        <span className="flex items-center">
          <h1>Between:({convo.conversationBetween?.length ?? 0}): </h1>
          {convo.conversationBetween?.map((member, index) => (
            <span
              key={index}
              className="border-violet-300 bg-violet-600 border-2 bg-clip-border p-1"
            >
              {member.alias}
            </span>
          ))}
        </span>
      </div>
      
      * currently online count
      <div className="border border-red-500 p-4">
        <h1>Currently online: {chatSocketState.userActiveCount}</h1>
        {Object.values(chatSocketState.users).map((user, index) => (
          <span
            key={index}
            className="border-violet-300 bg-violet-600 border-2 bg-clip-border p-1"
          >
            {user.alias}
          </span>
        ))}
      </div>
      
      * user info (optional)
      <div className="border border-green-500 p-4">
        <h1>Your info</h1>
        <p>id - name - email - role</p>
        <p>
          {user.id} - {`${user.firstName} ${user.lastName}`} - {user.email} -{' '}
          {user.role.name}
        </p>
      </div>
      
      * send message button
      <button
        className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
        onClick={sendMessage}
      >
        Send message
      </button>

      * messsage display
      <div>
        {chatSocketState.messages.map((e) => (
          <div key={e.id} color={e.from === user.id ? 'blue' : 'black'}>
            {e.content} by {e.from !== user.id ? e.from : 'you'} (at{' '}
            {new Date(e.at).toDateString()})
          </div>
        ))}
        <div color="blue">{chatSocketState.messagePending}</div>
      </div>
    </div>
  ); */
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
