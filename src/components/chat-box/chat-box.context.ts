import { createContext } from 'react';
import { Socket, io } from 'socket.io-client';

import {
  ConversationGroupEntity,
  MessageEntity,
  MessageReceivedPayload,
  UserConnectedPayload,
  UserDisconnectedPayload,
  UserJoinedPayload,
  defaultConversationGroup,
} from '@/types';

export interface ChatboxSocketContextState {
  userCount: number;
  userIds: number[];
  messages: MessageEntity[];
  messagePending: string | undefined;
  socket: Socket;
  chatbox: ConversationGroupEntity;
}

export const Actions = {
  SOCKET_MESSAGE_RECEIVED: 'socket_message_received' as const,
  SOCKET_MESSAGE_SENT: 'socket_message_sent' as const,
  SOCKET_USER_JOINED: 'socket_user_joined' as const,
  SOCKET_USER_CONNECTED: 'socket_user_connected' as const,
  SOCKET_USER_DISCONNECTED: 'socket_user_disconnected' as const,
  CHATBOX_RECEIVED: 'chatbox_received' as const,
  MESSAGE_RECEIVED: 'message_received' as const,
  MESSAGE_PENDING: 'message_pending' as const,
};

export type SocketContextPayload = string | string[] | Socket;

export interface ChatboxSocketContextActionPayload {
  type: (typeof Actions)[keyof typeof Actions];
  payload: unknown;
}

export interface ChatboxSocketContextProps {
  SocketState: ChatboxSocketContextState;
  SocketDispatch: React.Dispatch<ChatboxSocketContextActionPayload>;
}

export const initialSocketState: ChatboxSocketContextState = {
  userCount: 0,
  userIds: [],
  socket: io({ autoConnect: false }),
  messages: [],
  messagePending: undefined,
  chatbox: defaultConversationGroup,
};

export const SocketReducer = (
  state: ChatboxSocketContextState,
  action: ChatboxSocketContextActionPayload
): ChatboxSocketContextState => {
  console.log('Action: ' + action.type + ' - Payload: ', action.payload);

  switch (action.type) {
    case Actions.SOCKET_USER_CONNECTED: {
      const payload = action.payload as {
        eventPayload: UserConnectedPayload;
        socket: Socket;
      };
      return {
        ...state,
        userCount: payload.eventPayload.userCount,
        userIds: payload.eventPayload.userIds,
        socket: payload.socket,
      };
    }

    case Actions.SOCKET_USER_JOINED: {
      const payload = action.payload as UserJoinedPayload;

      return {
        ...state,
        userCount: payload.userCount,
        userIds: [...state.userIds, payload.userJoinedId],
      };
    }

    case Actions.SOCKET_USER_DISCONNECTED: {
      const payload = action.payload as UserDisconnectedPayload;

      return {
        ...state,
        userCount: payload.userCount,
        userIds: state.userIds.filter(
          (id) => id !== payload.userDisconnectedId
        ),
      };
    }

    case Actions.SOCKET_MESSAGE_RECEIVED: {
      const payload = action.payload as MessageReceivedPayload;

      return {
        ...state,
        messages: [...state.messages, payload],
      };
    }

    case Actions.CHATBOX_RECEIVED: {
      const payload = action.payload as ConversationGroupEntity;

      return {
        ...state,
        chatbox: payload,
      };
    }

    case Actions.MESSAGE_RECEIVED: {
      const payload = action.payload as MessageEntity[];

      return {
        ...state,
        messages: payload,
      };
    }

    case Actions.MESSAGE_PENDING: {
      const payload = action.payload as string;

      return {
        ...state,
        messagePending: payload,
      };
    }

    default: {
      return state;
    }
  }
};

const SocketContext = createContext<ChatboxSocketContextProps>({
  SocketState: initialSocketState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
