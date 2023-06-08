import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { SocketContext } from '../chat-box-context-wrapper';
import {
  CommonActions,
  SocketActions,
} from '../chat-box-context-wrapper/actions';
import loadingMessages from '../loading-screen/loading-messages';

import { hasResponse, useAltAxiosWithAuth } from '@/hooks';
import { selectAuth } from '@/stores';
import {
  MessageEntity,
  MessageReceivedPayload,
  MessageSentPayload,
} from '@/types';

export function ConversationGroupHelper() {
  const { SocketState: state, SocketDispatch } = useContext(SocketContext);
  const {
    userCount,
    userIds,
    socket,
    messages,
    conversationGroup,
    messagePending,
  } = state;
  const [isLoading, { response, error }] = useAltAxiosWithAuth<MessageEntity[]>(
    'get',
    `/chatboxes/${conversationGroup.id}/messages`,
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

    SocketDispatch({
      type: CommonActions.MESSAGE_RECEIVED,
      payload: response.data,
    });

    socket.on(
      SocketActions.SOCKET_MESSAGE_RECEIVED,
      (payload: MessageReceivedPayload) => {
        SocketDispatch({
          type: SocketActions.SOCKET_MESSAGE_RECEIVED,
          payload,
        });
        SocketDispatch({
          type: CommonActions.MESSAGE_PENDING,
          payload: undefined,
        });
      }
    );
  }, [isLoading]);

  const sendMessage = () => {
    const index = Math.floor(Math.random() * loadingMessages.length);

    socket.emit(SocketActions.SOCKET_MESSAGE_SENT, {
      chatboxId: conversationGroup.id,
      content: loadingMessages[index],
      userId: user.id,
      isGroup: true,
    } as MessageSentPayload);

    SocketDispatch({
      type: CommonActions.MESSAGE_PENDING,
      payload: loadingMessages[index],
    });

    return loadingMessages[index];
  };

  if (isLoading) return <p>... loading messages ....</p>;

  return (
    <div>
      <div className="border border-sky-500 p-4">
        <span className="flex">
          <h1>Admin: {conversationGroup.admin}</h1>
        </span>
        <span className="flex items-center">
          <h1>All members({conversationGroup.members?.length ?? 0}): </h1>
          {conversationGroup.members?.map((e) => (
            <span
              key={e}
              className="border-2 border-violet-300 bg-violet-600 bg-clip-border p-1"
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
            className="border-2 border-violet-300 bg-violet-600 bg-clip-border p-1"
          >
            {e}
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
          <div
            key={e.id}
            className={e.from === user.id ? 'text-blue-400' : 'text-black'}
          >
            {e.content} by {e.from !== user.id ? e.from : 'you'} (at{' '}
            {new Date(e.at).toDateString()})
          </div>
        ))}
        <div color="blue">{messagePending}</div>
      </div>
    </div>
  );
}

export default ConversationGroupHelper;