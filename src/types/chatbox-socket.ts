import { Reducer } from '@reduxjs/toolkit';
import { Socket, io } from 'socket.io-client';
import { z } from 'zod';

import { ChatboxEvents } from '@/constants';
import {
  MessageEntity,
  MessagePayload,
  UserPayload,
  conversationGroupZod,
  conversationZod,
  messageZod,
  minimalUserZod,
} from '@/types';
import { getZodDefault } from '@/utils';

const {
  actions: {
    ADD_ROOM,
    MESSAGE_PENDING,
    SOCKET_USER_JOINED,
    SOCKET_USER_CONNECTED,
    SOCKET_USER_DISCONNECTED,
    SOCKET_MESSAGE_SENT,
    SOCKET_MESSAGE_RECEIVED,
    SOCKET_MESSAGE_DELETED,
    SOCKET_MESSAGE_DELETING,
    SOCKET_MESSAGE_UPDATED,
    SOCKET_MESSAGE_UPDATING,
  },
  socketEmitEvents,
  socketListenEvents,
} = ChatboxEvents;

type PayloadMap = {
  [ADD_ROOM]: Partial<ChatboxSocket>;
  [MESSAGE_PENDING]?: string;
  [SOCKET_USER_JOINED]: UserPayload.Joined;
  [SOCKET_USER_CONNECTED]: UserPayload.Connected;
  [SOCKET_USER_DISCONNECTED]: UserPayload.Disconnected;
  [SOCKET_MESSAGE_SENT]: MessagePayload.Sent;
  [SOCKET_MESSAGE_RECEIVED]: MessageEntity;
  [SOCKET_MESSAGE_DELETED]: MessagePayload.Deleted;
  [SOCKET_MESSAGE_DELETING]: MessagePayload.Deleting;
  [SOCKET_MESSAGE_UPDATED]: MessagePayload.Updated;
  [SOCKET_MESSAGE_UPDATING]: MessagePayload.Updating;
};
type PayloadMapWithId = {
  [Key in keyof PayloadMap]: { convoId: string } & HasNullable<
    PayloadMap[Key],
    { data: PayloadMap[Key] },
    { data: PayloadMap[Key] }
  >;
};

type HandleEvent<T extends Record<keyof T, keyof PayloadMapWithId>> = {
  [Key in keyof T as T[Key]]: (payload: PayloadMapWithId[T[Key]]) => void;
};

export type ChatboxEmitEvents = HandleEvent<typeof socketEmitEvents>;
export type ChatboxListenEvents = HandleEvent<typeof socketListenEvents>;

export const chatboxSocketZod = z.object({
  convoId: z.string(),
  messages: z.array(messageZod),
  messagePending: z.string().optional(),
  conversation: conversationZod,
  conversationGroup: conversationGroupZod,
  users: z.record(z.number(), minimalUserZod),
  socket: z.custom<Socket>().default(io({ autoConnect: false })),
});
export type ChatboxSocket = z.infer<typeof chatboxSocketZod>;
export const initialChatboxSocket = getZodDefault(chatboxSocketZod);

// // reducer
// type ChatboxActions = typeof ChatboxEvents.actions;
// export type ChatboxSocketDispatch = {
//   [Key in keyof ChatboxActions]: {
//     type: ChatboxActions[Key];
//     payload: PayloadMapWithId[ChatboxActions[Key]];
//   };
// }[keyof ChatboxActions];

// export const initialChatboxSocketState = new Map<
//   string,
//   Nullable<ChatboxSocket>
// >();
// export type ChatboxSocketState = typeof initialChatboxSocketState;
// export type ChatboxReducer = Reducer<ChatboxSocketState, ChatboxSocketDispatch>;
