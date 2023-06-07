import { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import {
  Actions,
  SocketContextProvider,
  SocketReducer,
  initialSocketState,
} from './chat-box.context';

import { hasResponse, useAltAxiosWithAuth } from '@/hooks/use-axios';
import {
  ConversationEntity,
  UserConnectedPayload,
  UserDisconnectedPayload,
  UserJoinedPayload,
} from '@/types';

export interface SocketContextComponentProps extends PropsWithChildren {
  id: string;
}

const ChatboxContextWrapper = (props: SocketContextComponentProps) => {
  const [isChatboxLoading, { response, error }] =
    useAltAxiosWithAuth<ConversationEntity>('get', `/chatboxes/${props.id}`);
  const { children } = props;
  let socket: Socket;
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    initialSocketState
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isChatboxLoading) return;

    if (!hasResponse(response, error)) {
      console.log(error);

      return;
    }

    SocketDispatch({
      type: Actions.CHATBOX_RECEIVED,
      payload: response.data,
    });

    socket = io(`${import.meta.env.VITE_SERVER_URL}/chatbox`, {
      autoConnect: false,
      query: {
        chatboxId: response.data.id,
        userId: Math.floor(Math.random() * 10000),
      },
    });
    socket.connect();
    socket.on('connect', () => {
      handleUserEvents();
    });

    return () => {
      if (socket) socket.close();
    };
  }, [isChatboxLoading]);

  const handleUserEvents = () => {
    socket.on(
      Actions.SOCKET_USER_CONNECTED,
      (payload: UserConnectedPayload) => {
        socket.off(Actions.SOCKET_USER_CONNECTED);
        SocketDispatch({
          type: Actions.SOCKET_USER_CONNECTED,
          payload: { eventPayload: payload, socket },
        });
        setLoading(false);
      }
    );

    socket.on(Actions.SOCKET_USER_JOINED, (payload: UserJoinedPayload) => {
      SocketDispatch({
        type: Actions.SOCKET_USER_JOINED,
        payload,
      });
    });

    socket.on(
      Actions.SOCKET_USER_DISCONNECTED,
      (payload: UserDisconnectedPayload) => {
        SocketDispatch({
          type: Actions.SOCKET_USER_DISCONNECTED,
          payload,
        });
      }
    );
  };

  if (loading || isChatboxLoading) return <p>... loading Socket IO ....</p>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default ChatboxContextWrapper;
export * from './chat-box.context';
