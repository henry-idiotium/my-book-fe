import { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import {
  ConversationActions,
  ConversationGroupActions,
  SocketActions,
} from './actions';
import {
  SocketContextProvider,
  SocketReducer,
  initialSocketState,
} from './chat-box.context';

import { hasResponse, useAltAxiosWithAuth } from '@/hooks/use-axios';
import {
  ConversationEntity,
  ConversationGroupEntity,
  UserConnectedPayload,
  UserDisconnectedPayload,
  UserJoinedPayload,
} from '@/types';

export interface SocketContextComponentProps extends PropsWithChildren {
  id: string;
  dispatchType:
    | typeof ConversationActions.CONVERSATION_RECEIVED
    | typeof ConversationGroupActions.CONVERSATION_GROUP_RECEIVED;
}

const ChatboxContextWrapper = (props: SocketContextComponentProps) => {
  const requestUrl =
    props.dispatchType === ConversationActions.CONVERSATION_RECEIVED
      ? `/chatboxes/conversations/${props.id}`
      : `/chatboxes/${props.id}`;

  const [isChatboxLoading, { response, error }] = useAltAxiosWithAuth<
    ConversationEntity | ConversationGroupEntity
  >('get', requestUrl);
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
      type: props.dispatchType,
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
      SocketActions.SOCKET_USER_CONNECTED,
      (payload: UserConnectedPayload) => {
        socket.off(SocketActions.SOCKET_USER_CONNECTED);
        SocketDispatch({
          type: SocketActions.SOCKET_USER_CONNECTED,
          payload: { eventPayload: payload, socket },
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

  if (loading || isChatboxLoading) return <p>... loading Socket IO ....</p>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default ChatboxContextWrapper;
export * from './chat-box.context';
