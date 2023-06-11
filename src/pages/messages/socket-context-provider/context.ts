import { createContext } from 'react';

import actions from './actions';
import {
  ChatboxSocketContext,
  ChatboxSocketContextDispatch,
  ChatboxSocketContextState,
  chatboxSocketContextStateZod,
} from './types';

import { getZodDefault } from '@/utils';

export function socketReducer(
  state: ChatboxSocketContextState,
  { type, payload }: ChatboxSocketContextDispatch
) {
  console.log('Action: ' + type + ' - Payload: ', payload);

  switch (type) {
    case actions.SOCKET_USER_JOINED: {
      const activeUser = state.users.get(payload.userJoinedId);
      if (!activeUser || !activeUser.metadata) return;

      activeUser.metadata.isActive = true;
      const newUsers = new Map(state.users);

      newUsers.set(payload.userJoinedId, activeUser);

      return {
        ...state,
        userCount: payload.userCount,
        users: newUsers,
      };
    }

    case actions.SOCKET_USER_DISCONNECTED: {
      const newUsers = new Map(state.users);

      newUsers.delete(payload.userDisconnectedId);

      return {
        ...state,
        userCount: state.userCount - 1,
        users: newUsers,
      };
    }

    case actions.SOCKET_MESSAGE_RECEIVED: {
      return {
        ...state,
        messages: [...state.messages, payload],
      };
    }

    case actions.MESSAGE_PENDING: {
      return {
        ...state,
        messagePending: payload,
      };
    }

    case actions.SOCKET_MESSAGE_DELETED: {
      return {
        ...state,
        messages: state.messages.map((e) => {
          if (e.id === payload.id) return { ...e, content: null };

          return e;
        }),
      };
    }

    case actions.SOCKET_MESSAGE_UPDATED: {
      return {
        ...state,
        messages: state.messages.map((e) => {
          if (e.id === payload.id)
            return { ...e, content: payload.content, isEdited: true };

          return e;
        }),
      };
    }

    default:
      return state;
  }
}

export const initialSocketState = getZodDefault(chatboxSocketContextStateZod);
export const chatboxSocketContext = createContext<ChatboxSocketContext>({
  socketState: initialSocketState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  socketDispatch: () => {},
});
