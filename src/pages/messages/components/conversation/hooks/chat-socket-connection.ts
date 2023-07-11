import { useMemo, useState } from 'react';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';

import {
  useDeepCompareMemoize as deepCompareMemo,
  useDispatch,
  useSelector,
} from '@/hooks';
import {
  ChatSocketMap,
  chatSocketActions as actions,
  selectAuth,
  chatSocketSelectors as selectors,
} from '@/stores';
import { ChatSocketEntity } from '@/stores/chat-socket/types';
import { ChatSocketListener, ConversationEntity } from '@/types';
import { Convo } from '@/utils';

import UserEvents = ChatSocketListener.User.Events;
import MessageEvents = ChatSocketListener.Message.Events;

const CONNECT_TIMEOUT_LIMIT = 8000;

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
    dispatch(actions.socket.startConnection({ conversationId, token }));
  });

  useUpdateEffect(() => {
    // Loading limit
    if (!socketState) {
      setTimeout(() => setConnectFailed(!socketState), CONNECT_TIMEOUT_LIMIT);
      return;
    }

    const socket = ChatSocketMap.store.get(conversationId);
    if (!socket) return;

    socket.on(UserEvents.JOIN_CHAT, (payload) => {
      dispatch(
        actions.updateActiveUser({
          ...payload,
          conversationId,
          type: 'add',
        }),
      );
    });
    socket.on(UserEvents.LEAVE_CHAT, (payload) => {
      dispatch(
        actions.updateActiveUser({
          ...payload,
          conversationId,
          type: 'remove',
        }),
      );
    });

    socket
      .on(MessageEvents.READ_RECEIPT, (payload) => {
        dispatch(actions.updateMessageSeenLog({ conversationId, ...payload }));
      })
      .on(MessageEvents.RECEIVE, (payload) => {
        dispatch(actions.addMessage({ conversationId, ...payload }));
      })
      .on(MessageEvents.SEND_SUCCESS, (payload) => {
        dispatch(actions.resolvePendingMessage({ conversationId, ...payload }));
      })
      .on(MessageEvents.DELETE_NOTIFY, (payload) => {
        dispatch(actions.deleteMessage({ conversationId, ...payload }));
      })
      .on(MessageEvents.UPDATE_NOTIFY, (message) => {
        dispatch(actions.updateMessage({ conversationId, ...message }));
      });

    socket
      .on(MessageEvents.SEND_FAILURE, (payload) => {
        dispatch(actions.upsertMessageError({ conversationId, ...payload }));
      })
      .on(MessageEvents.UPDATE_FAILURE, (payload) => {
        dispatch(actions.upsertMessageError({ conversationId, ...payload }));
      })
      .on(MessageEvents.DELETE_FAILURE, (payload) => {
        dispatch(actions.upsertMessageError({ conversationId, ...payload }));
      });

    return () => {
      dispatch(actions.socket.disposeConnection({ conversationId }));
    };
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
