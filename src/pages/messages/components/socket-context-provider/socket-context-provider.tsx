import { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import actions from './actions';
import {
  chatboxSocketContext,
  initialSocketState,
  socketReducer,
} from './context';
import { ChatboxSocketContextState } from './types';

import { selectAuth } from '@/stores';
import {
  UserConnectedPayload,
  UserDisconnectedPayload,
  UserJoinedPayload,
} from '@/types';

export interface SocketContextProviderProps extends React.PropsWithChildren {
  id: string;
}

export function ChatboxSocketContextProvider({
  id,
  children,
}: SocketContextProviderProps) {
  const { token } = useSelector(selectAuth);
  const [socketState, socketDispatch] = useReducer(
    socketReducer,
    initialSocketState
  );
  const [loading, setLoading] = useState(true);
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (!isInit) {
      socketDispatch({
        type: actions.INIT,
        payload: {
          ...initialSocketState,
          socket: io(`${import.meta.env.VITE_SERVER_URL}/chatbox`, {
            query: { chatboxId: id },
            extraHeaders: { Authorization: token },
          }),
        },
      });
      setIsInit(true);

      return;
    }

    socketState.socket.on('connect', () => {
      handleUserEvents();
    });

    return () => {
      if (socketState.socket) socketState.socket.close();
    };
  }, [isInit]);

  function handleUserEvents() {
    socketState.socket.on(
      actions.SOCKET_USER_CONNECTED,
      (payload: UserConnectedPayload) => {
        socketState.socket.off(actions.SOCKET_USER_CONNECTED);
        const messages = payload.chatbox.messages ?? [];

        delete payload.chatbox.messages;

        const users = new Map(
          'conversationBetween' in payload.chatbox
            ? payload.chatbox.conversationBetween.map((e) => [e.id, e])
            : payload.chatbox.members?.map((e) => [e.id, e]) ?? []
        );

        const convo: Partial<ChatboxSocketContextState> =
          'conversationBetween' in payload.chatbox
            ? { conversation: payload.chatbox }
            : { conversationGroup: payload.chatbox };

        socketDispatch({
          type: actions.INIT,
          payload: {
            ...socketState,
            ...convo,
            messages,
            userCount: payload.userCount,
            users,
          },
        });

        setLoading(false);

        socketState.socket.on(
          actions.SOCKET_USER_JOINED,
          (payload: UserJoinedPayload) => {
            socketDispatch({
              type: actions.SOCKET_USER_JOINED,
              payload,
            });
          }
        );

        socketState.socket.on(
          actions.SOCKET_USER_DISCONNECTED,
          (payload: UserDisconnectedPayload) => {
            socketDispatch({
              type: actions.SOCKET_USER_DISCONNECTED,
              payload,
            });
          }
        );
      }
    );
  }

  if (loading) return <p>... loading Socket IO ....</p>;

  return (
    <chatboxSocketContext.Provider value={{ socketDispatch, socketState }}>
      {children}
    </chatboxSocketContext.Provider>
  );
}

export default ChatboxSocketContextProvider;
