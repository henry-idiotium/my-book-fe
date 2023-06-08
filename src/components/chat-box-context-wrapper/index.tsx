import { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket, io } from 'socket.io-client';

import { SocketActions } from './actions';
import {
  SocketContextProvider,
  SocketReducer,
  initialSocketState,
} from './chat-box.context';

import { selectAuth } from '@/stores';
import {
  UserConnectedPayload,
  UserDisconnectedPayload,
  UserJoinedPayload,
} from '@/types';

export interface SocketContextComponentProps extends PropsWithChildren {
  id: string;
  isGroup: boolean;
}

const ChatboxContextWrapper = (props: SocketContextComponentProps) => {
  const { token } = useSelector(selectAuth);
  const { children } = props;
  let socket: Socket;
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    initialSocketState
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(token);
    socket = io(`${import.meta.env.VITE_SERVER_URL}/chatbox`, {
      query: {
        chatboxId: props.id,
      },
      extraHeaders: {
        Authorization: token,
      },
    });
    socket.on('connect', () => {
      handleUserEvents();
    });

    return () => {
      if (socket) socket.close();
    };
  }, []);

  const handleUserEvents = () => {
    socket.on(
      SocketActions.SOCKET_USER_CONNECTED,
      (payload: UserConnectedPayload) => {
        socket.off(SocketActions.SOCKET_USER_CONNECTED);
        SocketDispatch({
          type: SocketActions.SOCKET_USER_CONNECTED,
          payload: { eventPayload: payload, socket, isGroup: props.isGroup },
        });
        setLoading(false);
      }
    );

    socket.on(
      SocketActions.SOCKET_USER_JOINED,
      (payload: UserJoinedPayload) => {
        SocketDispatch({
          type: SocketActions.SOCKET_USER_JOINED,
          payload,
        });
      }
    );

    socket.on(
      SocketActions.SOCKET_USER_DISCONNECTED,
      (payload: UserDisconnectedPayload) => {
        SocketDispatch({
          type: SocketActions.SOCKET_USER_DISCONNECTED,
          payload,
        });
      }
    );
  };

  if (loading) return <p>... loading Socket IO ....</p>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default ChatboxContextWrapper;
export * from './chat-box.context';
