import { useEffect, useMemo } from 'react';
import { useBoolean, useEffectOnce } from 'usehooks-ts';

import {
  useDeepCompareMemoize as deepCompareMemo,
  useDispatch,
  useSelector,
} from '@/hooks';
import {
  chatSocketStoreActions as actions,
  ChatSocketMap,
  selectAuth,
  chatSocketSelectors,
} from '@/stores';
import { ChatSocketEntity } from '@/stores/chat-socket/types';
import { ChatSocketListener as Listener } from '@/types';
import { Logger } from '@/utils';

const CONNECT_TIMEOUT_LIMIT = 5000;

export function useChatSocketConnection(convoId: string) {
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
      socket.on(Listener.User.Events.JOIN_CHAT, ({ activeUserIds, id }) => {
        const payload = { conversationId: convoId, activeUserIds, id };
        dispatch(actions.addActiveUser(payload));
      });

      // user leaves
      socket.on(Listener.User.Events.LEAVE_CHAT, ({ activeUserIds, id }) => {
        const payload = { conversationId: convoId, activeUserIds, id };
        dispatch(actions.removeActiveUser(payload));
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
    socket.on(Listener.EXCEPTION, (err) => Logger.error(err));

    return () => {
      socket.off();
      ChatSocketMap.store.delete(convoId);
    };
  });

  // Connect failed timeout
  useEffect(() => {
    if (chatSocketState) return;

    setTimeout(
      () => connectFailed.setValue(!!chatSocketState),
      CONNECT_TIMEOUT_LIMIT,
    );
  }, [chatSocketState]);

  const socketLoadingAssert = useMemo<SocketLoadingAssert>(() => {
    return chatSocketState
      ? { loading: false, state: chatSocketState }
      : { loading: true };
  }, deepCompareMemo(chatSocketState));

  return {
    ...socketLoadingAssert,
    connectFailed: connectFailed.value,
  };
}

export default useChatSocketConnection;

type SocketLoadingAssert =
  | { loading: true; state?: ChatSocketEntity }
  | { loading: false; state: ChatSocketEntity };
