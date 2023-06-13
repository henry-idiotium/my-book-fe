import { useEffect } from 'react';
import { io } from 'socket.io-client';

import actions from '../socket-context-provider/actions';
import { ChatboxSocket } from '../socket-context-provider/types';

import styles from './conversation.module.scss';

import loadingMessages from '@/components/loading-screen/loading-messages';
import { useDispatch, useSelector } from '@/hooks';
import { selectAuth } from '@/stores';
import { selectConvoById, userConnected } from '@/stores/convo/convo.slice';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConversationProps {
  id: string;
}

export function Conversation({ id }) {
  const { user, token } = useSelector(selectAuth);
  const convo = useSelector(selectConvoById(id));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!convo) {
      const socket: ChatboxSocket = io(
        `${import.meta.env.VITE_SERVER_URL}/chatbox`,
        {
          query: { chatboxId: id },
          extraHeaders: { Authorization: token },
        }
      );
      socket.on(actions.SOCKET_USER_CONNECTED, (payload) => {
        socket.off(actions.SOCKET_USER_CONNECTED);

        socket.on(actions.SOCKET_USER_JOINED, (payload) => {
          socketDispatch({ type: actions.SOCKET_USER_JOINED, payload });
        });

        socket.on(actions.SOCKET_USER_DISCONNECTED, (payload) => {
          socketDispatch({
            type: actions.SOCKET_USER_DISCONNECTED,
            payload,
          });
        });
        dispatch(userConnected({ chatbox }));
      });

      return;
    }
    socket.on(actions.SOCKET_MESSAGE_RECEIVED, (payload) => {
      socketDispatch({ type: actions.SOCKET_MESSAGE_RECEIVED, payload });
      socketDispatch({ type: actions.MESSAGE_PENDING, payload: undefined });
    });

    socket.on(actions.SOCKET_MESSAGE_DELETED, (payload) => {
      socketDispatch({ type: actions.SOCKET_MESSAGE_DELETED, payload });
    });

    socket.on(actions.SOCKET_MESSAGE_UPDATED, (payload) => {
      socketDispatch({ type: actions.SOCKET_MESSAGE_UPDATED, payload });
    });
  }, []);

  function sendMessage() {
    const index = Math.floor(Math.random() * loadingMessages.length);
    const content = loadingMessages[index];

    socket.emit(actions.SOCKET_MESSAGE_SENT, {
      chatboxId: convo.id,
      isGroup: false,
      content,
    });

    socketDispatch({ type: actions.MESSAGE_PENDING, payload: content });

    return content;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateMessage = (id: string, content: string) => {
    socket.emit(actions.SOCKET_MESSAGE_UPDATING, {
      chatboxId: convo.id,
      id,
      content: content + ' edited---',
      isGroup: false,
    });
    socketDispatch({
      type: actions.SOCKET_MESSAGE_UPDATED,
      payload: { id, content: content + ' edited---' },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteMessage = (id: string) => {
    socket.emit(actions.SOCKET_MESSAGE_DELETING, {
      chatboxId: convo.id,
      id,
      isGroup: false,
    });
  };

  return (
    <div className={styles.container}>
      <div>
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
        <div className="border border-red-500 p-4">
          <h1>Currently online: {userCount}</h1>
          {Array.from(users).map(([_, member], index) => (
            <span
              key={index}
              className="border-violet-300 bg-violet-600 border-2 bg-clip-border p-1"
            >
              {member.alias}
            </span>
          ))}
        </div>
        <div className="border border-green-500 p-4">
          <h1>Your info</h1>
          <p>id - name - email - role</p>
          <p>
            {user.id} - {`${user.firstName} ${user.lastName}`} - {user.email} -{' '}
            {user.role.name}
          </p>
        </div>
        <button
          className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
          onClick={sendMessage}
        >
          Send message
        </button>
        <div>
          {messages.map((e) => (
            <div key={e.id} color={e.from === user.id ? 'blue' : 'black'}>
              {e.content} by {e.from !== user.id ? e.from : 'you'} (at{' '}
              {new Date(e.at).toDateString()})
            </div>
          ))}
          <div color="blue">{messagePending}</div>
        </div>
      </div>
    </div>
  );
}
export default Conversation;

export * from './empty-conversation';
