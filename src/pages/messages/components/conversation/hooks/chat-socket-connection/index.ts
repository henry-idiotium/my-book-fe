import { useMemo } from 'react';
import { useBoolean, useEffectOnce } from 'usehooks-ts';

import { useDispatch, useInitialMemo, useSelector } from '@/hooks';
import {
  ChatSocketMap,
  selectAuth,
  chatSocketSelectors as selectors,
} from '@/stores';
import { ChatSocketEntity } from '@/stores/chat-socket/types';
import { Convo } from '@/utils';

import * as Constants from './constants';
import { initChatSocketListeners } from './init-chat-socket-listeners';

export function useChatSocketConnection(
  conversationId: string,
): ConnectionState {
  const dispatch = useDispatch();

  const { token, user: sessionUser } = useSelector(selectAuth);
  const socketState = useSelector(selectors.getById(conversationId));

  const checksGreenLit = useBoolean(false);
  const connectFailed = useInitialMemo(() => !socketState, false, [
    checksGreenLit.value,
    !socketState,
  ]);

  const participants = useMemo(() => {
    const participants = socketState?.participants;
    if (!participants) return [];

    return participants.filter((pt) => pt.id !== sessionUser.id);
  }, [socketState?.participants?.length]);

  const name = useMemo(() => {
    if (!socketState) return '';

    return Convo.getName({ ...socketState, participants });
  }, [participants, socketState?.name]);

  /** Initialize connection. */
  useEffectOnce(() => {
    // init connection checks
    setTimeout(checksGreenLit.setTrue, Constants.CONNECT_TIMEOUT_LIMIT);

    const socket = ChatSocketMap.connect(conversationId, token, {
      latestMessagesCount: Constants.LATEST_MESSAGES_COUNT,
    });
    initChatSocketListeners(conversationId, socket, dispatch);

    return () => {
      socket.removeAllListeners().off().close(); // remove listeners and close
      ChatSocketMap.store.delete(conversationId); // delete the socket instance
    };
  });

  if (!socketState) return { loading: true, connectFailed };

  return {
    ...socketState,
    loading: false,
    connectFailed,
    participants,
    name,
  };
}

type ChatSocketConnectionState = RequiredPick<ChatSocketEntity, 'name'>;
type SocketStateAssertion =
  | ({ loading: false } & ChatSocketConnectionState)
  | ({ loading: true } & Partial<ChatSocketConnectionState>);

type ConnectionState = SocketStateAssertion & {
  connectFailed: boolean;
};
