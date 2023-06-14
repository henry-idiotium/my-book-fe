import { useEffect } from 'react';
import { io } from 'socket.io-client';

import styles from './conversation.module.scss';

import loadingMessages from '@/components/loading-screen/loading-messages';
import { useDispatch, useSelector } from '@/hooks';
import {
  chatSocketActions as actions,
  chatSocketRecord,
  selectAuth,
  selectChatSocketById,
} from '@/stores';
import { ChatSocket, chatSocketEvents as events } from '@/types';

export interface ConversationProps {
  id: string;
}

export function Conversation({ id }: ConversationProps) {
  const { user, token } = useSelector(selectAuth);
  const chatSocketState = useSelector(selectChatSocketById(id));
  const dispatch = useDispatch();

  useEffect(() => {
    if (chatSocketState) return;

    // init socket
    const socket: ChatSocket = io(
      `${import.meta.env.VITE_SERVER_URL}/chatbox`,
      {
        query: { chatboxId: id },
        extraHeaders: { Authorization: token },
      }
    );

    // add socket to current state holder
    chatSocketRecord[id] = socket; // add socket object into record

    // init listeners
    socket.on(events.userConnected.name, ({ chatbox, userActiveCount }) => {
      socket.off(events.userConnected.name);

      socket.on(events.userJoined.name, ({ userActiveCount, userJoinedId }) => {
        dispatch(
          actions.userJoined({ convoId: id, userActiveCount, userJoinedId })
        );
      });

      socket.on(events.userDisconnected.name, ({ id: userId }) => {
        dispatch(actions.userDisconnected({ convoId: id, userId }));
      });

      socket.on(events.exception.name, (err) => {
        if (import.meta.env.DEV) console.log(err);
      });

      dispatch(actions.userConnected({ chatbox, userActiveCount }));
    });

    socket.on(events.messageReceived.name, (payload) => {
      dispatch(actions.messageReceived({ ...payload, convoId: id }));
      dispatch(actions.messagePending({ convoId: id, content: null }));
    });

    socket.on(events.messageDeleted.name, ({ id: msgId }) => {
      dispatch(actions.messageDeleted({ convoId: id, id: msgId }));
    });

    socket.on(events.messageUpdated.name, ({ content, id: msgId }) => {
      dispatch(actions.messageUpdated({ convoId: id, id: msgId, content }));
    });

    return () => {
      socket.off(); // clear up listeners
      delete chatSocketRecord[id];
    };
  }, []);

  function sendMessage() {
    const socket = chatSocketRecord[id];
    if (!socket?.connected) return;

    const index = Math.floor(Math.random() * loadingMessages.length);
    const content = loadingMessages[index];

    socket.emit(events.messageSent.name, {
      chatboxId: id,
      isGroup: false,
      content,
    });

    dispatch(actions.messagePending({ convoId: id, content }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateMessage = (messageId: string, content: string) => {
    const socket = chatSocketRecord[id];
    if (!socket?.connected) return;

    socket.emit(events.messageUpdating.name, {
      content: content + 'edited',
      id,
      chatboxId: id,
      isGroup: false,
    });

    dispatch(
      actions.messageUpdated({
        convoId: id,
        content: content + 'edited',
        id: messageId,
      })
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteMessage = (messageId: string) => {
    const socket = chatSocketRecord[id];
    if (!socket?.connected) return;

    socket.emit(events.messageDeleting.name, {
      id: messageId,
      chatboxId: id,
      isGroup: false,
    });
  };

  if (!chatSocketState) return null;
  const convo = chatSocketState.conversation;

  return (
    <div className={styles.container}>
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
        {chatSocketState.messages.map((e) => (
          <div key={e.id} color={e.from === user.id ? 'blue' : 'black'}>
            {e.content} by {e.from !== user.id ? e.from : 'you'} (at{' '}
            {new Date(e.at).toDateString()})
          </div>
        ))}
        <div color="blue">{chatSocketState.messagePending}</div>
      </div>
    </div>
  );
}

export default Conversation;
export * from './empty-conversation';
