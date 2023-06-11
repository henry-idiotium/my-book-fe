import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import loadingMessages from '../loading-screen/loading-messages';

import actions from '@/pages/messages/socket-context-provider/actions';
import { chatboxSocketContext } from '@/pages/messages/socket-context-provider/context';
import { selectAuth } from '@/stores';
import { MessageEntity } from '@/types';

export function ConversationHelper() {
  const {
    socketState: {
      userCount,
      users,
      socket,
      messages,
      conversation,
      messagePending,
    },
    socketDispatch,
  } = useContext(chatboxSocketContext);
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    socket.on(actions.SOCKET_MESSAGE_RECEIVED, (payload: MessageEntity) => {
      socketDispatch({
        type: actions.SOCKET_MESSAGE_RECEIVED,
        payload,
      });
      socketDispatch({
        type: actions.MESSAGE_PENDING,
        payload: undefined,
      });
    });

    socket.on(actions.SOCKET_MESSAGE_DELETED, (payload) => {
      socketDispatch({
        type: actions.SOCKET_MESSAGE_DELETED,
        payload,
      });
    });

    socket.on(actions.SOCKET_MESSAGE_UPDATED, (payload) => {
      socketDispatch({
        type: actions.SOCKET_MESSAGE_UPDATED,
        payload,
      });
    });
  }, []);

  const sendMessage = () => {
    const index = Math.floor(Math.random() * loadingMessages.length);

    socket.emit(actions.SOCKET_MESSAGE_SENT, {
      chatboxId: conversation.id,
      content: loadingMessages[index],
      isGroup: false,
    });

    socketDispatch({
      type: actions.MESSAGE_PENDING,
      payload: loadingMessages[index],
    });

    return loadingMessages[index];
  };

  const updateMessage = (id: string, content: string) => {
    socket.emit(actions.SOCKET_MESSAGE_UPDATING, {
      chatboxId: conversation.id,
      id,
      content: content + ' edited---',
      isGroup: false,
    });
    socketDispatch({
      type: actions.SOCKET_MESSAGE_UPDATED,
      payload: { id, content: content + ' edited---' },
    });
  };

  const deleteMessage = (id: string) => {
    socket.emit(actions.SOCKET_MESSAGE_DELETING, {
      chatboxId: conversation.id,
      id,
      isGroup: false,
    });
  };

  return (
    <div>
      <div className="border-sky-500 border p-4">
        <span className="flex items-center">
          <h1>Between:({conversation.conversationBetween?.length ?? 0}): </h1>
          {conversation.conversationBetween?.map((e, index) => (
            <span
              key={e.id}
              className="border-violet-300 bg-violet-600 border-2 bg-clip-border p-1"
            >
              {e.id}
            </span>
          ))}
        </span>
      </div>
      <div className="border border-red-500 p-4">
        <h1>Currently online: {userCount}</h1>
        {Array.from(users, ([key, value]) => value).map((e) => (
          <span
            key={e.id}
            className="border-violet-300 bg-violet-600 border-2 bg-clip-border p-1"
          >
            {e.id}
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
            <button
              className="border border-blue-500"
              onClick={() => updateMessage(e.id, e.content ?? '')}
            >
              update
            </button>
            <button
              className="border border-red-500"
              onClick={() => deleteMessage(e.id)}
            >
              delete
            </button>
          </div>
        ))}
        <div color="blue">{messagePending}</div>
      </div>
    </div>
  );
}

export default ConversationHelper;
