import { PropsWithChildren, useEffect, useReducer, useState } from 'react';

import {
  SocketActions,
  SocketContextProvider,
  SocketReducer,
  initialSocketState,
} from './chat-box.context';

import { useSocket } from '@/hooks';

const SocketContextComponent = (props: PropsWithChildren) => {
  const { children } = props;
  const socket = useSocket(`${import.meta.env.VITE_SERVER_URL}/chatbox`);
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    initialSocketState
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      socket.emit(SocketActions.USER_CONNECTING);

      socket.on(SocketActions.USER_CONNECTED, (payload: unknown) => {
        SocketDispatch({
          type: SocketActions.USER_CONNECTED,
          payload: { userCount: payload, socket },
        });
        setLoading(false);
      });

      socket.on(SocketActions.USER_DISCONNECTED, (payload) => {
        SocketDispatch({ type: SocketActions.USER_DISCONNECTED, payload });
      });
    });
  }, []);

  if (loading) return <p>... loading Socket IO ....</p>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
