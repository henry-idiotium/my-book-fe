import { useEffect } from 'react';
import { io } from 'socket.io-client';

import styles from './conversation.module.scss';

import loadingMessages from '@/components/loading-screen/loading-messages';
import { useDispatch, useSelector } from '@/hooks';
import { selectAuth } from '@/stores';
import {
  messageDeleted,
  messagePending,
  messageReceive as messageReceived,
  messageUpdated,
  selectConvoById,
  socketMap,
  userConnected,
  userDisconnected,
  userJoined,
} from '@/stores/convo/convo.slice';
import { ChatboxSocket, chatboxEvents as actions } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConversationProps {
  id: string;
}

export function Conversation({ id }: ConversationProps) {
  const { user, token } = useSelector(selectAuth);
  const convoState = useSelector(selectConvoById(id));
  const dispatch = useDispatch();

  useEffect(() => {
    if (convoState) return;

    const socket: ChatboxSocket = io(
      `${import.meta.env.VITE_SERVER_URL}/chatbox`,
      {
        query: { chatboxId: id },
        extraHeaders: { Authorization: token },
      }
    );

    socket.on(actions.userConnected.name, ({ chatbox, userActiveCount }) => {
      socket.off(actions.userConnected.name);

      socket.on(
        actions.userJoined.name,
        ({ userActiveCount, userJoinedId }) => {
          dispatch(
            userJoined({ chatboxId: id, userActiveCount, userJoinedId })
          );
        }
      );

      socket.on(actions.userDisconnected.name, ({ id: userId }) => {
        dispatch(userDisconnected({ chatboxId: id, userId }));
      });

      dispatch(userConnected({ chatbox, socket, userActiveCount }));
    });

    socket.on(actions.messageReceived.name, (payload) => {
      dispatch(messageReceived({ ...payload, chatboxId: id }));
      dispatch(messagePending({ chatboxId: id, content: null }));
    });

    socket.on(actions.messageDeleted.name, (payload) => {
      dispatch(messageDeleted({ chatboxId: id, id: payload.id }));
    });

    socket.on(actions.messageUpdated.name, ({ content, id: messageId }) => {
      dispatch(messageUpdated({ chatboxId: id, content, id: messageId }));
    });
  }, []);

  function sendMessage() {
    const index = Math.floor(Math.random() * loadingMessages.length);
    const content = loadingMessages[index];

    const socket = socketMap.get(id);
    if (!socket) {
      // handle error
      return;
    }

    socket.emit(actions.messageSent.name, {
      content,
    });

    dispatch(messagePending({ chatboxId: id, content }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateMessage = (messageId: string, content: string) => {
    const socket = socketMap.get(id);
    if (!socket) {
      // handle error
      return;
    }

    socket.emit(actions.messageUpdating.name, {
      content: content + 'edited',
      id,
    });
    dispatch(
      messageUpdated({
        chatboxId: id,
        content: content + 'edited',
        id: messageId,
      })
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteMessage = (messageId: string) => {
    const socket = socketMap.get(id);
    if (!socket) {
      // handle error
      return;
    }

    socket.emit(actions.messageDeleting.name, {
      id: messageId,
    });
  };

  if (!convoState) return null;
  const convo = convoState.conversation;
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
          <h1>Currently online: {convoState.userActiveCount}</h1>
          {Array.from(convoState.users).map(([_, member], index) => (
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
          {convoState.messages.map((e) => (
            <div key={e.id} color={e.from === user.id ? 'blue' : 'black'}>
              {e.content} by {e.from !== user.id ? e.from : 'you'} (at{' '}
              {new Date(e.at).toDateString()})
            </div>
          ))}
          <div color="blue">{convoState.messagePending}</div>
        </div>
      </div>
    </div>
  );
}
export default Conversation;

export * from './empty-conversation';
