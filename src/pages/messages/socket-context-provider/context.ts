import { createContext } from 'react';

import actions from './actions';
import {
  ChatboxSocketContext,
  ChatboxSocketContextDispatch,
  ChatboxSocketContextState,
  chatboxSocketContextStateZod,
} from './types';

import { ConversationEntity, ConversationGroupEntity } from '@/types';
import { getZodDefault } from '@/utils';

export function socketReducer(
  state: ChatboxSocketContextState,
  { type, payload }: ChatboxSocketContextDispatch
): ChatboxSocketContextState {
  console.log('Action: ' + type + ' - Payload: ', payload);

  switch (type) {
    case actions.SOCKET_USER_CONNECTED: {
      return {
        ...state,
        userCount: payload.eventPayload.userCount,
        userIds: new Set(payload.eventPayload.userIds),
        socket: payload.socket,
        ...(payload.isGroup
          ? {
              conversationGroup: payload.eventPayload
                .chatbox as ConversationGroupEntity,
            }
          : {
              conversation: payload.eventPayload.chatbox as ConversationEntity,
            }),
      };
    }

    case actions.SOCKET_USER_JOINED: {
      const newUserIds = new Set(state.userIds);

      newUserIds.add(payload.userJoinedId);

      return {
        ...state,
        userCount: payload.userCount,
        userIds: newUserIds,
      };
    }

    case actions.SOCKET_USER_DISCONNECTED: {
      const newUserIds = new Set(state.userIds);

      newUserIds.delete(payload.userDisconnectedId);

      return {
        ...state,
        userCount: state.userCount - 1,
        userIds: newUserIds,
      };
    }

    case actions.SOCKET_MESSAGE_RECEIVED: {
      return {
        ...state,
        messages: [...state.messages, payload],
      };
    }

    case actions.MESSAGE_RECEIVED: {
      return {
        ...state,
        messages: payload,
      };
    }

    case actions.MESSAGE_PENDING: {
      return {
        ...state,
        messagePending: payload,
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
