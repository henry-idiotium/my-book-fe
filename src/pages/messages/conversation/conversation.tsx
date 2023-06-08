import { useContext, useEffect } from 'react';

import actions from '../socket-context-provider/actions';
import { chatboxSocketContext } from '../socket-context-provider/context';
import ChatboxSocketContextProvider from '../socket-context-provider/socket-context-provider';

import styles from './conversation.module.scss';

import loadingMessages from '@/components/loading-screen/loading-messages';
import { hasResponse, useAltAxiosWithAuth, useSelector } from '@/hooks';
import { selectAuth } from '@/stores';
import {
  ConversationEntity,
  MessageEntity,
  MessageReceivedPayload,
  MessageSentPayload,
} from '@/types';

export interface ConversationProps {
  id: ConversationEntity['id'];
}

export function Conversation({ id }: ConversationProps) {
  const {
    socketState: {
      userCount,
      userIds,
      socket,
      messages,
      conversation,
      messagePending,
    },
    socketDispatch,
  } = useContext(chatboxSocketContext);
  const [isLoading, { response, error }] = useAltAxiosWithAuth<MessageEntity[]>(
    'get',
    `/chatboxes/conversations/${conversation.id}/messages`,
    undefined,
    { params: { count: 5 } }
  );
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    if (isLoading) return;

    if (!hasResponse(response, error)) {
      console.log(error);

      return;
    }

    socketDispatch({
      type: actions.MESSAGE_RECEIVED,
      payload: response.data,
    });

    socket.on(
      actions.SOCKET_MESSAGE_RECEIVED,
      (payload: MessageReceivedPayload) => {
        socketDispatch({
          type: actions.SOCKET_MESSAGE_RECEIVED,
          payload,
        });
        socketDispatch({
          type: actions.MESSAGE_PENDING,
          payload: undefined,
        });
      }
    );
  }, [isLoading]);

  function sendMessage() {
    const index = Math.floor(Math.random() * loadingMessages.length);

    socket.emit(actions.SOCKET_MESSAGE_SENT, {
      chatboxId: conversation.id,
      content: loadingMessages[index],
      userId: user.id,
      isGroup: false,
    });

    socketDispatch({
      type: actions.MESSAGE_PENDING,
      payload: loadingMessages[index],
    });

    return loadingMessages[index];
  }

  return (
    <div className={styles.container}>
      <ChatboxSocketContextProvider id={id} isGroup={false}>
        <div>
          <div className="border-sky-500 border p-4">
            <span className="flex items-center">
              <h1>
                Between:({conversation.conversationBetween?.length ?? 0}):{' '}
              </h1>
              {conversation.conversationBetween?.map((e) => (
                <span
                  key={e}
                  className="border-violet-300 bg-violet-600 border-2 bg-clip-border p-1"
                >
                  {e}
                </span>
              ))}
            </span>
          </div>
          <div className="border border-red-500 p-4">
            <h1>Currently online: {userCount}</h1>
            {Array.from(userIds).map((e) => (
              <span
                key={e}
                className="border-violet-300 bg-violet-600 border-2 bg-clip-border p-1"
              >
                {e}
              </span>
            ))}
          </div>
          <div className="border border-green-500 p-4">
            <h1>Your info</h1>
            <p>id - name - email - role</p>
            <p>
              {user.id} - {`${user.firstName} ${user.lastName}`} - {user.email}{' '}
              - {user.role.name}
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
      </ChatboxSocketContextProvider>
    </div>
  );
}
export default Conversation;
