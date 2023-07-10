import { useEffect, useMemo, useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

import {
  useDeepCompareMemoize as deepCompareMemo,
  useDispatch,
  useSelector,
} from '@/hooks';
import {
  chatSocketActions,
  selectAuth,
  chatSocketSelectors as selectors,
} from '@/stores';
import { ChatSocketEntity } from '@/stores/chat-socket/types';
import { ConversationEntity } from '@/types';
import { Convo } from '@/utils';

const CONNECT_TIMEOUT_LIMIT = 5000;

export function useChatSocketConnection(conversationId: string) {
  const dispatch = useDispatch();

  const { token, user: sessionUser } = useSelector(selectAuth);
  const socketState = useSelector(selectors.getById(conversationId));

  const [connectFailed, setConnectFailed] = useState(false);

  const socketStateAssertion = useMemo<SocketStateAssertion>(() => {
    if (!socketState) return { loading: true };

    const { isGroup, activeUserIds, ...convo } = socketState;

    const convoWithoutMainUser = {
      ...convo,
      participants: convo.participants.filter((pt) => pt.id !== sessionUser.id),
    };

    const activeConversation = {
      ...convoWithoutMainUser,
      name: Convo.getName(convoWithoutMainUser),
    };

    return {
      loading: false,
      state: socketState,
      activeConversation,
    };
  }, deepCompareMemo(socketState));

  useEffectOnce(() => {
    const payload = { conversationId, token };

    dispatch(chatSocketActions.startConnection(payload));

    return () => {
      dispatch(chatSocketActions.disposeConnection(payload));
    };
  });

  // Connect failed timeout
  useEffect(() => {
    if (socketState) return;

    setTimeout(() => setConnectFailed(!socketState), CONNECT_TIMEOUT_LIMIT);
  }, [!socketState]);

  return {
    ...socketStateAssertion,
    connectFailed,
  };
}

type ChatSocketConnectionState = {
  state: ChatSocketEntity;
  activeConversation: RequiredPick<ConversationEntity, 'name'>;
};
type SocketStateAssertion =
  | ({ loading: false } & ChatSocketConnectionState)
  | ({ loading: true } & Partial<ChatSocketConnectionState>);
