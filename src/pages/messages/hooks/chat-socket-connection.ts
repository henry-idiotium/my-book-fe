import { useEffect } from 'react';
import { useBoolean } from 'usehooks-ts';

import { useDispatch, useSelector } from '@/hooks';
import {
  chatSocketActions as actions,
  chatSocketMap,
  getOrConnectChatSocket,
  selectAuth,
  selectChatSocketById,
} from '@/stores';
import { ChatSocketEntity, chatSocketEvents as events } from '@/types';

const CONNECT_TIMEOUT_LIMIT = 5000;

export function useChatSocketConnection(convoId: string): Result {
  const dispatch = useDispatch();

  const { token } = useSelector(selectAuth);
  const chatSocketState = useSelector(selectChatSocketById(convoId));

  const connectFailed = useBoolean(false);

  // Initialize socket event listeners
  useEffect(() => {
    if (chatSocketState) return;

    const socket = getOrConnectChatSocket(convoId, token);

    // connected
    socket.on(events.userConnected.name, ({ chatbox, userActiveCount }) => {
      socket.off(events.userConnected.name);

      // user joined
      socket.on(events.userJoined.name, ({ userActiveCount, userJoinedId }) => {
        dispatch(
          actions.userJoined({ convoId, userActiveCount, userJoinedId })
        );
      });

      // user disconnect
      socket.on(events.userDisconnected.name, ({ id: userId }) => {
        dispatch(actions.userDisconnected({ convoId, userId }));
      });

      // server exception
      socket.on(events.exception.name, (err) => {
        if (import.meta.env.DEV) console.log(err);
      });

      dispatch(actions.connectUser({ chatbox, userActiveCount }));
    });

    // message received
    socket.on(events.messageReceived.name, (payload) => {
      dispatch(actions.messageReceived({ ...payload, convoId }));
      dispatch(actions.messagePending({ convoId, content: null }));
    });

    // message deleted
    socket.on(events.messageDeleted.name, ({ id }) => {
      dispatch(actions.messageDeleted({ convoId, id }));
    });

    // message updatedd
    socket.on(events.messageUpdated.name, ({ content, id }) => {
      dispatch(actions.messageUpdated({ convoId, id, content }));
    });

    return () => {
      socket.off();
      chatSocketMap.delete(convoId);
    };
  }, []);

  // Connect failed watcher
  useEffect(() => {
    if (!chatSocketState) {
      // Set timmer in case if unable to connect.
      // Use the state value for boolean, in case where
      // the connection is success.
      setTimeout(
        () => connectFailed.setValue(!!chatSocketState),
        CONNECT_TIMEOUT_LIMIT
      );
      return;
    }
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
