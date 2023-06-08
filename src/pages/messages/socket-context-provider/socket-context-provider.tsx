import { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket, io } from 'socket.io-client';

import actions from './actions';
import {
  chatboxSocketContext,
  initialSocketState,
  socketReducer,
} from './context';

import { SocketActions } from '@/components/chat-box-context-wrapper/actions';
import { selectAuth } from '@/stores';
import {
  UserConnectedPayload,
  UserDisconnectedPayload,
  UserJoinedPayload,
} from '@/types';

export interface SocketContextProviderProps extends React.PropsWithChildren {
  id: string;
  isGroup: boolean;
}

export function ChatboxSocketContextProvider({
  id,
  isGroup,
  children,
}: SocketContextProviderProps) {
  const { token } = useSelector(selectAuth);
  const [socketState, socketDispatch] = useReducer(
    socketReducer,
    initialSocketState
  );
  const [loading, setLoading] = useState(true);

  let socket: Socket;

  useEffect(() => {
    socket = io(`${import.meta.env.VITE_SERVER_URL}/chatbox`, {
      query: { chatboxId: id },
      extraHeaders: { Authorization: token },
    });

    socket.on('connect', () => {
      handleUserEvents();
    });

    return () => {
      if (socket) socket.close();
    };
  }, []);

  function handleUserEvents() {
    socket.on(
      actions.SOCKET_USER_CONNECTED,
      (payload: UserConnectedPayload) => {
        socket.off(actions.SOCKET_USER_CONNECTED);
        socketDispatch({
          type: actions.SOCKET_USER_CONNECTED,
          payload: { eventPayload: payload, socket, isGroup },
        });
        setLoading(false);
      }
    );

    socket.on(
      SocketActions.SOCKET_USER_JOINED,
      (payload: UserJoinedPayload) => {
        socketDispatch({
          type: SocketActions.SOCKET_USER_JOINED,
          payload,
        });
      }
    );

    socket.on(
      SocketActions.SOCKET_USER_DISCONNECTED,
      (payload: UserDisconnectedPayload) => {
        socketDispatch({
          type: SocketActions.SOCKET_USER_DISCONNECTED,
          payload,
        });
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
