import { useBoolean, useDispatch, useEffectOnce, useInitialMemo, useSelector } from '@/hooks';
import { ChatSocketMap, selectAuth, chatSocketSelectors as selectors } from '@/stores';
import { ChatSocketEntity } from '@/stores/chat-socket/types';

import * as Constants from './constants';
import { initChatSocketListeners } from './helpers';

export function useChatSocketConnection(conversationId: string): ConnectionState {
  const dispatch = useDispatch();

  const { token, user: sessionUser } = useSelector(selectAuth);
  const socketState = useSelector(selectors.getById(conversationId));

  const checksGreenLit = useBoolean(false);
  const connectFailed = useInitialMemo(() => !socketState, false, [
    checksGreenLit.value,
    !socketState,
  ]);

  /** Initialize connection. */
  useEffectOnce(() => {
    // init connection checks
    setTimeout(checksGreenLit.setTrue, Constants.CONNECT_TIMEOUT_LIMIT);

    const socket = ChatSocketMap.connect(conversationId, token, {
      latestMessagesCount: Constants.LATEST_MESSAGES_COUNT,
    });
    initChatSocketListeners(conversationId, socket, sessionUser.id, dispatch);

    return () => {
      socket.removeAllListeners().off().close(); // remove listeners and close
      ChatSocketMap.store.delete(conversationId); // delete the socket instance
    };
  });

  if (!socketState) return { loading: true, connectFailed };

  return {
    state: socketState,
    loading: false,
    connectFailed,
  };
}

type SocketStateAssertion =
  | { loading: false; state: ChatSocketEntity }
  | { loading: true; state?: ChatSocketEntity };

type ConnectionState = SocketStateAssertion & {
  connectFailed: boolean;
};
