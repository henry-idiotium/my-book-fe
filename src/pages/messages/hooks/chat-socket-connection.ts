import { useEffect } from 'react';
import { useBoolean, useEffectOnce } from 'usehooks-ts';

import { useDispatch, useSelector } from '@/hooks';
import {
  chatSocketActions as actions,
  ChatSocketMap,
  selectAuth,
  chatSocketSelectors,
} from '@/stores';
import { ChatSocketEntity } from '@/stores/chat-socket/types';
import { ChatSocketListener as Listener } from '@/types';

const CONNECT_TIMEOUT_LIMIT = 5000;

export function useChatSocketConnection(convoId: string): Result {
  const dispatch = useDispatch();

  const { token } = useSelector(selectAuth);
  const chatSocketState = useSelector(chatSocketSelectors.getById(convoId));

  const connectFailed = useBoolean(false);

  // Initialize socket event listeners
  useEffectOnce(() => {
    if (chatSocketState) return;

    const socket = ChatSocketMap.getOrConnect(convoId, token);

    // connected
    socket.on(Listener.User.Events.CONNECT, (payload) => {
      dispatch(actions.addConversation(payload));

      // terminate listener
      socket.off(Listener.User.Events.CONNECT);

      // user joins
      socket.on(Listener.User.Events.JOIN_CHAT, ({ id: userId }) => {
        dispatch(
          actions.addActiveUser({
            conversationId: convoId,
            id: userId,
          })
        );
      });

      // user leaves
      socket.on(Listener.User.Events.LEAVE_CHAT, ({ id: userId }) => {
        dispatch(
          actions.removeActiveUser({
            conversationId: convoId,
            id: userId,
          })
        );
      });
    });

    // message received
    socket.on(Listener.Message.Events.RECEIVE, (payload) => {
      dispatch(actions.addMessage({ conversationId: convoId, ...payload }));
    });

    // message updated
    socket.on(Listener.Message.Events.UPDATE_NOTIFY, (payload) => {
      dispatch(actions.updateMessage({ conversationId: convoId, ...payload }));
    });

    // message deleted
    socket.on(Listener.Message.Events.DELETE_NOTIFY, ({ id }) => {
      dispatch(actions.deleteMessage({ conversationId: convoId, id }));
    });

    // server exception
    socket.on(Listener.EXCEPTION, (err) => {
      if (import.meta.env.DEV) console.error(err);
    });

    return () => {
      socket.off();
      ChatSocketMap.store.delete(convoId);
    };
  });

  // Connect failed watcher
  useEffect(() => {
    if (chatSocketState) return;

    setTimeout(
      () => connectFailed.setValue(!!chatSocketState),
      CONNECT_TIMEOUT_LIMIT
    );
    return;
  }, [chatSocketState]);

  const socketLoadingAssert: SocketLoadingAssert = chatSocketState
    ? { loading: false, state: chatSocketState }
    : { loading: true };

  return {
    ...socketLoadingAssert,
    connectFailed: connectFailed.value,
  };
}

export default useChatSocketConnection;

type SocketLoadingAssert =
  | { loading: true; state?: ChatSocketEntity }
  | { loading: false; state: ChatSocketEntity };
type Result = SocketLoadingAssert & {
  connectFailed: boolean;
};
