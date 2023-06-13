import { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import actions from './actions';
import {
  chatboxSocketContext,
  initialSocketState,
  socketReducer,
} from './context';

import { selectAuth } from '@/stores';

interface Props extends React.PropsWithChildren {
  id: string;
}

export function SocketContextProvider({ id, children }: Props) {
  const { token } = useSelector(selectAuth);
  const [socketState, socketDispatch] = useReducer(
    socketReducer,
    initialSocketState
  );

  const [loading, setLoading] = useState(true);

  const { socket } = socketState;

  // init socket
  useEffect(() => {
    socketDispatch({
      type: actions.INIT,
      payload: {
        socket: io(`${import.meta.env.VITE_SERVER_URL}/chatbox`, {
          query: { chatboxId: id },
          extraHeaders: { Authorization: token },
        }),
      },
    });
  }, []);

  // connect socket
  useEffect(() => {
    if (socket.connected) return;

    socket.on('connect', () => {
      handleConnectUser();
    });

    return () => {
      socket.close();
    };
  }, [socket]);

  function handleConnectUser() {
    socket.on(actions.SOCKET_USER_CONNECTED, (payload) => {
      socket.off(actions.SOCKET_USER_CONNECTED);

      socket.on(actions.SOCKET_USER_JOINED, (payload) => {
        socketDispatch({ type: actions.SOCKET_USER_JOINED, payload });
      });

      socket.on(actions.SOCKET_USER_DISCONNECTED, (payload) => {
        socketDispatch({ type: actions.SOCKET_USER_DISCONNECTED, payload });
      });
    });
  }

  if (loading) return <p>... loading Socket IO ....</p>;

  return (
    <chatboxSocketContext.Provider value={{ socketDispatch, socketState }}>
      {children}
    </chatboxSocketContext.Provider>
  );
}

export default SocketContextProvider;
