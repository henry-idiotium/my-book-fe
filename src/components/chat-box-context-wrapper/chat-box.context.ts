import { createContext } from 'react';
import { Socket, io } from 'socket.io-client';

import {
  CommonActions,
  ConversationActions,
  ConversationGroupActions,
  SocketActions,
} from './actions';

import {
  ConversationEntity,
  ConversationGroupEntity,
  MessageEntity,
  MessageReceivedPayload,
  UserConnectedPayload,
  UserDisconnectedPayload,
  UserJoinedPayload,
  defaultConversation,
  defaultConversationGroup,
} from '@/types';

export interface ChatboxSocketContextState {
  userCount: number;
  userIds: Set<number>;
  messages: MessageEntity[];
  messagePending: string | undefined;
  socket: Socket;
  conversation: ConversationEntity;
  conversationGroup: ConversationGroupEntity;
}

const Actions = {
  ...CommonActions,
  ...SocketActions,
  ...ConversationActions,
  ...ConversationGroupActions,
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
  userIds: new Set<number>(),
  socket: io({ autoConnect: false }),
  messages: [],
  messagePending: undefined,
  conversation: defaultConversation,
  conversationGroup: defaultConversationGroup,
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
        userIds: new Set(payload.eventPayload.userIds),
        socket: payload.socket,
      };
    }

    case Actions.SOCKET_USER_JOINED: {
      const payload = action.payload as UserJoinedPayload;
      const newUserIds = new Set(state.userIds);

      newUserIds.add(payload.userJoinedId);

      return {
        ...state,
        userCount: payload.userCount,
        userIds: newUserIds,
      };
    }

    case Actions.SOCKET_USER_DISCONNECTED: {
      const payload = action.payload as UserDisconnectedPayload;

      const newUserIds = new Set(state.userIds);

      newUserIds.delete(payload.userDisconnectedId);

      return {
        ...state,
        userCount: payload.userCount,
        userIds: newUserIds,
      };
    }

    case Actions.SOCKET_MESSAGE_RECEIVED: {
      const payload = action.payload as MessageReceivedPayload;

      return {
        ...state,
        messages: [...state.messages, payload],
      };
    }

    case Actions.CONVERSATION_GROUP_RECEIVED: {
      const payload = action.payload as ConversationGroupEntity;

      return {
        ...state,
        conversationGroup: payload,
      };
    }

    case Actions.CONVERSATION_RECEIVED: {
      const payload = action.payload as ConversationEntity;

      return {
        ...state,
        conversation: payload,
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

export const SocketContext = createContext<ChatboxSocketContextProps>({
  SocketState: initialSocketState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  SocketDispatch: () => {},
});
export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;
